# SEditor

A cross-platform, lightweight, and extensible code editor built with Electron, React, and TypeScript.  
Inspired by modern IDEs but focused on simplicity, speed, and full customizability.

---

## ✨ Features

- Cross-platform desktop application (Windows, macOS, Linux)
- Monaco Editor integration (same core editor as VSCode)
- Project file tree and multi-tab support
- Syntax highlighting, IntelliSense, auto-indent, code folding
- Git integration (status, stage/unstage, commit, push/pull)
- Global search across project files (full-text, fast). 
  - Search a file from the opened folder / search text in the folder opened.
- AI chat assistant integrated (contextual code support, explanations, code generation)
- Customizable themes (light/dark mode, and many others)
- Persistent user settings (theme, sidebar width, zoom level etc.)
- Quick open and keyboard shortcuts inspired by VSCode

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher (tested with v22.14.0)
- **npm** or **yarn**

---

## 🚀 Setup & Running

```bash
# Install dependencies
npm install
```

```bash
# Run in development mode
npm start
```

```bash
# Create production build (multi-platform)
npm run make
```

## 📄 Documentation

Additional in-depth design and architecture details can be found in the following Markdown files (included in `Documentation/` folder):

- `Technologies.md`
- `System-Architecture.md`
- `State-Management.md`
- `Keyboard-Shortcuts.md`

These documents describe architectural decisions, state structure (Redux slices), IPC communication patterns, and the overall design philosophy.

---

## 🤝 Contributing

This project was created as part of a bachelor’s thesis and is not currently accepting external contributions. However, feel free to fork and experiment!

---

## 📜 License

MIT License

---

## 🧑‍💻 Author

Roman Onisim-Cristian (@onisimm)