# Nimbus Fraud Model

This service trains a graph-enriched fraud classifier from the public Kaggle PaySim dataset and serves checkout scores through FastAPI.

## Setup

From the repository root, use the Pylance-selected environment:

```powershell
.\.venv\Scripts\python.exe -m pip install -r ml_service\requirements.txt
```

Kaggle authentication is required for the public download. Configure the Kaggle CLI token or environment variables according to Kaggle's instructions, then run:

```powershell
.\.venv\Scripts\python.exe ml_service\train.py --download-kaggle
```

The trainer downloads `ealaxi/paysim1`, loads a reproducible 500,000-row sample by default, performs a time-ordered 80/20 split, builds account graph-degree features, trains a class-balanced random forest, reports ROC-AUC and average precision, and writes `ml_service/artifacts/fraud_model.joblib`. Use `--max-rows 0` only on a machine with enough memory for the full 6M-row dataset.

Start the API:

```powershell
.\.venv\Scripts\python.exe -m uvicorn ml_service.api:app --reload --port 8000
```

Check readiness:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Score a transaction:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8000/score -ContentType 'application/json' -Body (@{
  amount = 920
  transaction_type = 'TRANSFER'
  step = 120
  origin_account = 'C123'
  destination_account = 'C456'
  device_id = 'dev_demo'
  ip_address = '203.0.113.8'
  shipping_address = '100 Main Street'
  old_balance_origin = 920
  new_balance_origin = 0
} | ConvertTo-Json)
```

The current React app retains its local fallback engine. The API is intentionally separate so checkout remains usable when the model service is stopped. Do not treat the bundled heuristic or demo seed records as a production fraud model; retrain with institution-specific labels before deployment.
