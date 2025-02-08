# 🧠 GuiPT API

A custom AI assistant API built to answer questions about Gui Ruggiero using Google Gemini on a Firebase Cloud Function.

Built by [Gui Ruggiero](https://guiruggiero.com/?utm_source=github&utm_medium=guipt).

### ✨ Features

- Gemini Flash model through Gemini API integration for fast responses with multi-language support
- User input sanitization and validation with custom error messages for security
- CORS-enabled for website integration
- System instruction with long context and easter eggs
- Automated system instruction updates from Google Docs

### 🛠️ Prerequisites

- Node.js
- Firebase CLI
- Gemini API key

### 📦 Dependencies

- `@google/generative-ai` - Gemini API integration
- `firebase-admin` & `firebase-functions` - Firebase Cloud Functions backend
- `sanitize-html` - input sanitization
- `eslint` - code linting
- `jsdom` & `html-to-text` - system instruction update

---

#### 📄 License

This project is licensed under the [MIT License](LICENSE). Attribution is required.

#### ⚠️ Disclaimer

This software is provided "as is" without any warranties. Use at your own risk. The author is not responsible for any consequences of using this software.
