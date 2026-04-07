> **Archived:** The GuiPT Cloud Function has been migrated into the [website](https://github.com/guiruggiero/website) repository (`functions/`). This repo is kept for historical reference only.

[![CodeQL](https://github.com/guiruggiero/guipt/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/guiruggiero/guipt/actions/workflows/github-code-scanning/codeql)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=guiruggiero_guipt&metric=bugs)](https://sonarcloud.io/summary/new_code?id=guiruggiero_guipt)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=guiruggiero_guipt&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=guiruggiero_guipt)
[![Dependencies](https://github.com/guiruggiero/guipt/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/guiruggiero/guipt/actions/workflows/dependabot/dependabot-updates)

# 🧠 GuiPT API

A custom AI assistant API built to answer questions about Gui Ruggiero using Google Gemini on a Firebase Cloud Function.

### ✨ Features
- **Fast responses with multi-language support** using Gemini Flash Lite model through the Gemini API
- **User input sanitization and validation** with custom error messages for security
- **CORS-enabled** for website integration
- **Error tracking** and logging

### 📦 Dependencies
- `@google/genai` - Gemini API integration
- `@langfuse/client` - prompt management
- `@sentry/node` - Sentry integration
- `eslint` - code linting
- `firebase-functions` and `firebase-tools` - serverless backend
- `sanitize-html` - input sanitization

---

#### 📄 License
This project is licensed under the [MIT License](LICENSE). Attribution is required.

#### ⚠️ Disclaimer
This software is provided "as is" without any warranties. Use at your own risk. The author is not responsible for any consequences of using this software.
