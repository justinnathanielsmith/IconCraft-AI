## 2026-02-04 - Exposed API Key in Client-Side Bundle
**Vulnerability:** The Google Gemini API key is injected into the client-side bundle via `vite.config.ts` using `define`. This makes the key visible to anyone inspecting the deployed application's source code.
**Learning:** Client-side applications cannot securely store secrets. `process.env` replacements during build time bake the secret into the artifact.
**Prevention:** Secrets must be kept on the server. The frontend should request a backend proxy (e.g., a serverless function) which then authenticates with the third-party API.

## 2026-02-18 - Unsanitized LLM Prompt Injection
**Vulnerability:** User inputs (prompt and style description) were directly interpolated into the LLM prompt without sanitization. This allowed users to potentially inject instructions or control characters that could confuse the model or bypass generation constraints.
**Learning:** LLM prompts are code execution environments in natural language. Unsanitized user input is akin to unsanitized SQL in a database query.
**Prevention:** Always sanitize user inputs to remove control characters and use robust delimiters (like triple quotes) to separate user data from system instructions.
