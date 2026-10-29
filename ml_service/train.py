from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import joblib
import kagglehub
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import average_precision_score, classification_report, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DATA_DIR = BASE_DIR / "data"
DEFAULT_ARTIFACT = BASE_DIR / "artifacts" / "fraud_model.joblib"
DATASET_HANDLE = "ealaxi/paysim1"


def find_csv(data_dir: Path) -> Path:
    csv_files = sorted(data_dir.rglob("*.csv"))
    if not csv_files:
        raise FileNotFoundError(f"No CSV found under {data_dir}. Download the Kaggle dataset first.")
    preferred = [path for path in csv_files if path.name.lower() == "ps_20174392719_1491204439457_log.csv"]
    return preferred[0] if preferred else csv_files[0]


def download_kaggle_dataset(data_dir: Path) -> Path:
    downloaded = Path(kagglehub.dataset_download(DATASET_HANDLE))
    data_dir.mkdir(parents=True, exist_ok=True)
    csv_path = find_csv(downloaded)
    destination = data_dir / csv_path.name
    if csv_path.resolve() != destination.resolve():
        destination.write_bytes(csv_path.read_bytes())
    return destination


def add_graph_features(frame: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, dict[str, int]]]:
    origin_counts = frame["nameOrig"].value_counts()
    destination_counts = frame["nameDest"].value_counts()
    result = frame.copy()
    result["origin_degree"] = result["nameOrig"].map(origin_counts).fillna(0)
    result["destination_degree"] = result["nameDest"].map(destination_counts).fillna(0)
    result["account_degree"] = result["origin_degree"] + result["destination_degree"]
    result["hour"] = result["step"] % 24
    stats = {
        "origin": {str(key): int(value) for key, value in origin_counts.items()},
        "destination": {str(key): int(value) for key, value in destination_counts.items()},
    }
    return result, stats


def train(input_csv: Path, artifact_path: Path, max_rows: int | None = 500_000) -> dict[str, Any]:
    frame = pd.read_csv(input_csv, nrows=max_rows)
    required = {
        "step", "type", "amount", "nameOrig", "nameDest", "oldbalanceOrg",
        "newbalanceOrig", "oldbalanceDest", "newbalanceDest", "isFraud",
    }
    missing = required.difference(frame.columns)
    if missing:
        raise ValueError(f"Dataset is missing required columns: {sorted(missing)}")

    frame, degree_stats = add_graph_features(frame)
    frame = frame.sort_values("step").reset_index(drop=True)
    split_index = max(1, int(len(frame) * 0.8))
    train_frame = frame.iloc[:split_index]
    test_frame = frame.iloc[split_index:]

    feature_columns = [
        "step", "hour", "amount", "oldbalanceOrg", "newbalanceOrig",
        "oldbalanceDest", "newbalanceDest", "origin_degree",
        "destination_degree", "account_degree", "type",
    ]
    categorical_columns = ["type"]
    numeric_columns = [column for column in feature_columns if column not in categorical_columns]
    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", "passthrough", numeric_columns),
            ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical_columns),
        ]
    )
    model = Pipeline(
        steps=[
            ("features", preprocessor),
            (
                "classifier",
                RandomForestClassifier(
                    n_estimators=180,
                    max_depth=18,
                    min_samples_leaf=2,
                    class_weight="balanced_subsample",
                    n_jobs=-1,
                    random_state=42,
                ),
            ),
        ]
    )
    model.fit(train_frame[feature_columns], train_frame["isFraud"])
    probabilities = model.predict_proba(test_frame[feature_columns])[:, 1]
    predictions = (probabilities >= 0.5).astype(int)
    metrics = {
        "roc_auc": round(float(roc_auc_score(test_frame["isFraud"], probabilities)), 6),
        "average_precision": round(float(average_precision_score(test_frame["isFraud"], probabilities)), 6),
        "classification_report": classification_report(
            test_frame["isFraud"], predictions, output_dict=True, zero_division=0
        ),
    }
    metadata = {
        "model_version": "paysim-rf-graph-v1",
        "dataset": f"Kaggle:{DATASET_HANDLE}",
        "trained_rows": int(len(train_frame)),
        "test_rows": int(len(test_frame)),
        "max_rows": max_rows,
        "fraud_rate": round(float(frame["isFraud"].mean()), 6),
        "feature_columns": feature_columns,
        "metrics": metrics,
    }
    artifact = {
        "model": model,
        "degree_stats": degree_stats,
        "degree_threshold": float(frame["account_degree"].quantile(0.99)),
        "amount_threshold": float(frame["amount"].quantile(0.95)),
        "metadata": metadata,
    }
    artifact_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, artifact_path)
    return metadata


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the Nimbus fraud model on Kaggle PaySim data.")
    parser.add_argument("--data", type=Path, default=DEFAULT_DATA_DIR, help="CSV file or directory containing the Kaggle dataset")
    parser.add_argument("--artifact", type=Path, default=DEFAULT_ARTIFACT)
    parser.add_argument("--max-rows", type=int, default=500_000, help="Maximum Kaggle rows to load; use 0 for the full dataset")
    parser.add_argument("--download-kaggle", action="store_true", help="Download public Kaggle dataset ealaxi/paysim1")
    args = parser.parse_args()

    if args.download_kaggle:
        csv_path = download_kaggle_dataset(args.data if args.data.suffix == "" else args.data.parent)
    else:
        csv_path = args.data if args.data.is_file() else find_csv(args.data)
    metadata = train(csv_path, args.artifact, max_rows=args.max_rows or None)
    print(json.dumps(metadata, indent=2, default=str))


if __name__ == "__main__":
    main()
