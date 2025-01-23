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

### ⚠️ Disclaimer

The scripts in this repository are provided "as is" without any warranties. Use them at your own risk. The author is not responsible for any consequences of using this software, including but not limited to potential website blocking or other issues. Please use the scripts responsibly and ensure you comply with all relevant terms of service and regulations.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. You are free to use, modify, and distribute this software for any purpose, provided you include the original copyright notice and the full license text in any copies or substantial portions of the software. Attribution is required.