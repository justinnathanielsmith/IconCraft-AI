## 2026-02-04 - Exposed API Key in Client-Side Bundle
**Vulnerability:** The Google Gemini API key is injected into the client-side bundle via `vite.config.ts` using `define`. This makes the key visible to anyone inspecting the deployed application's source code.
**Learning:** Client-side applications cannot securely store secrets. `process.env` replacements during build time bake the secret into the artifact.
**Prevention:** Secrets must be kept on the server. The frontend should request a backend proxy (e.g., a serverless function) which then authenticates with the third-party API.
