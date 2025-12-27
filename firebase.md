# Deploy to Firebase (Next.js)

This portfolio is a **Next.js App Router** app with **server routes** (`/api/chat`, `/api/tts`, `/api/summarize`).  
To deploy on Firebase, use **Firebase Hosting “Web Frameworks”** (it provisions the needed server runtime).

## One-time setup (local machine)

1) Install Firebase CLI:

```bash
npm i -g firebase-tools
```

2) Login and select your Firebase project:

```bash
firebase login
firebase projects:list
firebase use --add
```

## Initialize Firebase Hosting for Next.js

From the repo root:

```bash
firebase init hosting
```

When prompted:
- Choose **Hosting**
- Choose **a Web Framework** setup
- Select **Next.js**
- Pick your region

This will create `firebase.json` and any required Firebase files.

## Deploy

```bash
firebase deploy
```

## Optional: enable Gemini features

After the first deploy, Firebase will create a backend service for the Next.js server runtime.
Add **`GEMINI_API_KEY`** as an environment variable in the Firebase/GCP console for that backend service, then redeploy.

