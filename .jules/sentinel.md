## 2026-02-04 - Exposed API Key in Client-Side Bundle
**Vulnerability:** The Google Gemini API key is injected into the client-side bundle via `vite.config.ts` using `define`. This makes the key visible to anyone inspecting the deployed application's source code.
**Learning:** Client-side applications cannot securely store secrets. `process.env` replacements during build time bake the secret into the artifact.
**Prevention:** Secrets must be kept on the server. The frontend should request a backend proxy (e.g., a serverless function) which then authenticates with the third-party API.

## 2026-02-18 - Unsanitized LLM Prompt Injection
**Vulnerability:** User inputs (prompt and style description) were directly interpolated into the LLM prompt without sanitization. This allowed users to potentially inject instructions or control characters that could confuse the model or bypass generation constraints.
**Learning:** LLM prompts are code execution environments in natural language. Unsanitized user input is akin to unsanitized SQL in a database query.
**Prevention:** Always sanitize user inputs to remove control characters and use robust delimiters (like triple quotes) to separate user data from system instructions.

## 2026-02-27 - Duplicate Sanitization and Error Leakage
**Vulnerability:** A duplicate `sanitizeInput` function definition shadowed the intended robust version, potentially allowing prompt injection. Additionally, error objects containing sensitive headers (API keys) were logged directly to the console.
**Learning:** Duplicate function definitions can silently disable critical security logic. Verbose error logging can inadvertently leak credentials.
**Prevention:** Use linters to catch duplicate declarations. Always sanitize error messages (e.g., `error.message`) before logging, never log the raw error object if it might contain request details.

## 2026-03-05 - Inconsistent Input Sanitization
**Vulnerability:** The application used a weak local `sanitizePromptInput` function (only escaping quotes/newlines) while a robust `sanitizeInput` (handling control chars and triple quotes) existed but was unused.
**Learning:** Security features are useless if not wired up. Dead code (unused security functions) creates a false sense of security.
**Prevention:** Audit codebase for unused exports, especially security-related ones. Enforce consistent usage of security helpers.
