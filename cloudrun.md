# Deploy to Google Cloud Run

Project: `gen-lang-client-0454197075`

## Prereqs

- Install Google Cloud SDK (`gcloud`)
- Authenticate: `gcloud auth login`

## Deploy (source-based build)

```bash
gcloud config set project gen-lang-client-0454197075
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

gcloud run deploy portfolio \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Optional: enable Gemini features

```bash
gcloud run services update portfolio \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```

