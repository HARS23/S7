from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
ARTIFACT_PATH = Path(os.getenv("FRAUD_MODEL_PATH", BASE_DIR / "artifacts" / "fraud_model.joblib"))

app = FastAPI(
    title="Nimbus Autonomous Fraud API",
    version="1.0.0",
    description="Graph-enriched checkout fraud scoring service trained on Kaggle PaySim data.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def root() -> dict[str, Any]:
    return {
        "service": "Nimbus Autonomous Fraud Detection API",
        "status": "ready" if ARTIFACT_PATH.exists() else "model_not_trained",
        "model": "paysim-rf-graph-v1",
        "dataset": "Kaggle:ealaxi/paysim1",
        "trained_rows": 400000,
        "demo": {
            "health": "/health",
            "swagger_ui": "/docs",
            "score_endpoint": "POST /score",
        },
    }


class ScoreRequest(BaseModel):
    amount: float = Field(ge=0)
    transaction_type: str = Field(default="PAYMENT")
    step: int = Field(default=0, ge=0)
    origin_account: str = Field(min_length=1)
    destination_account: str = Field(default="unknown")
    device_id: str = Field(default="unknown")
    ip_address: str = Field(default="unknown")
    shipping_address: str = Field(default="unknown")
    old_balance_origin: float = Field(default=0, ge=0)
    new_balance_origin: float = Field(default=0, ge=0)
    old_balance_destination: float = Field(default=0, ge=0)
    new_balance_destination: float = Field(default=0, ge=0)


class ScoreResponse(BaseModel):
    fraud_probability: float
    risk_score: int
    action: str
    confidence: float
    model_version: str
    model_source: str
    graph_features: dict[str, float]
    signals: list[str]
    scored_at: str


def load_artifact() -> dict[str, Any]:
    if not ARTIFACT_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail="Fraud model is not trained. Run `python ml_service/train.py --download-kaggle` first.",
        )
    return joblib.load(ARTIFACT_PATH)


def build_features(payload: ScoreRequest, artifact: dict[str, Any]) -> pd.DataFrame:
    degree_stats = artifact.get("degree_stats", {})
    origin_degree = float(degree_stats.get("origin", {}).get(payload.origin_account, 0))
    destination_degree = float(degree_stats.get("destination", {}).get(payload.destination_account, 0))
    account_degree = origin_degree + destination_degree
    hour = (payload.step // 1) % 24

    row = {
        "amount": payload.amount,
        "step": payload.step,
        "hour": hour,
        "oldbalanceOrg": payload.old_balance_origin,
        "newbalanceOrig": payload.new_balance_origin,
        "oldbalanceDest": payload.old_balance_destination,
        "newbalanceDest": payload.new_balance_destination,
        "origin_degree": origin_degree,
        "destination_degree": destination_degree,
        "account_degree": account_degree,
        "type": payload.transaction_type,
    }
    return pd.DataFrame([row])


def get_signals(payload: ScoreRequest, features: pd.DataFrame, artifact: dict[str, Any]) -> list[str]:
    signals: list[str] = []
    row = features.iloc[0]
    if row["account_degree"] >= artifact.get("degree_threshold", 10):
        signals.append("account neighborhood has elevated transaction connectivity")
    if payload.amount >= artifact.get("amount_threshold", 1000):
        signals.append("transaction amount is above the learned high-value percentile")
    if payload.transaction_type.upper() in {"TRANSFER", "CASH_OUT"}:
        signals.append("transaction type is commonly associated with movement of funds")
    if payload.old_balance_origin > 0 and payload.new_balance_origin == 0:
        signals.append("origin account balance was fully depleted")
    if not signals:
        signals.append("no high-signal graph or transaction pattern detected")
    return signals


@app.get("/health")
def health() -> dict[str, Any]:
    artifact_exists = ARTIFACT_PATH.exists()
    metadata = joblib.load(ARTIFACT_PATH).get("metadata", {}) if artifact_exists else {}
    return {
        "status": "ready" if artifact_exists else "model_not_trained",
        "model_version": metadata.get("model_version"),
        "dataset": metadata.get("dataset"),
        "trained_rows": metadata.get("trained_rows", 0),
    }


@app.post("/score", response_model=ScoreResponse)
def score(payload: ScoreRequest) -> ScoreResponse:
    artifact = load_artifact()
    features = build_features(payload, artifact)
    model = artifact["model"]
    fraud_probability = float(model.predict_proba(features)[0, 1])
    risk_score = round(fraud_probability * 100)
    action = "BLOCK" if fraud_probability >= 0.85 else "STEP_UP" if fraud_probability >= 0.45 else "ALLOW"
    signals = get_signals(payload, features, artifact)
    confidence = min(0.99, max(0.50, abs(fraud_probability - 0.5) * 1.6 + 0.50))

    return ScoreResponse(
        fraud_probability=round(fraud_probability, 6),
        risk_score=risk_score,
        action=action,
        confidence=round(confidence, 6),
        model_version=artifact["metadata"]["model_version"],
        model_source=artifact["metadata"]["dataset"],
        graph_features={
            "origin_degree": float(features.iloc[0]["origin_degree"]),
            "destination_degree": float(features.iloc[0]["destination_degree"]),
            "account_degree": float(features.iloc[0]["account_degree"]),
        },
        signals=signals,
        scored_at=datetime.now(timezone.utc).isoformat(),
    )
