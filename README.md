# 🧠 GuiPT endpoint

A specialized chatbot built with Google's Gemini API to answer questions about Gui Ruggiero. The bot runs on Firebase Cloud Functions and features safety measures to ensure safety.

Built by [Gui Ruggiero](https://guiruggiero.com/?utm_source=github&utm_medium=guipt).

### ✨ Features

- Gemini 1.5 Flash integration for fast, context-aware responses with multi-language support
- Configurable safety settings and generation parameters
- User input sanitization and validation for secure responses
- CORS-enabled for web integration
- Automated prompt updates from external source

### 🛠️ Prerequisites

- Node.js 22.x
- Firebase CLI
- Gemini API key

### 📦 Required dependencies

- `@google/generative-ai` - Gemini API integration
- `firebase-admin` & `firebase-functions` - Cloud Functions backend
- `sanitize-html` - input security
- `jsdom` & `html-to-text` - prompt processing

---

### 📄 License

This project is licensed under the [MIT License](LICENSE). Attribution is required.

### ⚠️ Disclaimer

This software is provided "as is" without any warranties. Use at your own risk. The author is not responsible for any consequences of using this software. Please use it responsibly and ensure you comply with all relevant terms of service and regulations.
