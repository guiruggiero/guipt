[![CodeQL](https://github.com/guiruggiero/guipt/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/guiruggiero/guipt/actions/workflows/github-code-scanning/codeql)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=guiruggiero_guipt&metric=bugs)](https://sonarcloud.io/summary/new_code?id=guiruggiero_guipt)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=guiruggiero_guipt&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=guiruggiero_guipt)
[![Dependencies](https://github.com/guiruggiero/guipt/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/guiruggiero/guipt/actions/workflows/dependabot/dependabot-updates)

# 🧠 GuiPT API

A custom AI assistant API built to answer questions about Gui Ruggiero using Google Gemini on a Firebase Cloud Function.

### ✨ Features

- Gemini Flash model through Gemini API integration for fast responses with multi-language support
- User input sanitization and validation with custom error messages for security
- CORS-enabled for website integration
- System instruction with long context and easter eggs
- Automated system instruction updates from Google Docs
- Sentry error tracking and monitoring for debugging

### 🛠️ Prerequisites

- Node.js
- Firebase CLI
- Gemini API key
- Sentry DSN key

### 📦 Dependencies

- `@google/generative-ai` - Gemini API integration
- `@sentry/node` - Sentry integration
- `firebase-admin` & `firebase-functions` - Firebase Cloud Functions backend
- `sanitize-html` - input sanitization
- `eslint` - code linting
- `jsdom` & `html-to-text` - system instruction update

---

#### 📄 License

This project is licensed under the [MIT License](LICENSE). Attribution is required.

#### ⚠️ Disclaimer

This software is provided "as is" without any warranties. Use at your own risk. The author is not responsible for any consequences of using this software.
