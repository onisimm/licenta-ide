# licenta-ide

## Overview

Idea: **_Code Editor with Electron and TypeScript_**

This is a modern **code editor** built using **Electron** and **TypeScript**. Inspired by tools like **VSCode**, it aims to deliver core editor functionalities while being an educational journey into desktop app development. TypeScript ensures type safety and scalability, while Electron provides a powerful framework for cross-platform desktop applications.

---

## Challenges

- Balancing simplicity and functionality in core features.
- Implementing advanced capabilities efficiently.
- Scaling the app for larger projects without performance loss.

---

## Why Build This?

- Learn **Electron** and **TypeScript** in-depth.
- Understand the challenges behind modern code editors.
- Build a functional, real-world application.
- Explore advanced topics like **real-time collaboration** and **AI (LLM) integration**.

---

## Getting Started

### Prerequisites

- **Node.js (v22.14.0 or higher, up to 22.14.0)** and **npm/yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/onisimm/licenta-ide
   ```

### Running the project

Open the terminal and run `npm start`

## Contribution Practices

### Issues

- Every task must have an associated issue.
- Workflow: **Issue → Branch (named after the issue) → Pull Request (PR) → Main branch.**
- Always work on tasks tied to an issue and its corresponding branch.

### Commits

- Use [git cz](https://www.npmjs.com/package/git-cz) to ensure consistent and readable commit messages.
- Start commit messages with the issue ID. For example:
  - `#632 add search bar functionality`
  - `#632 fix search bar invisible text`
  - `#632 add search bar unit tests (UTs)`

### Formatting Code

Refer to the [DEVENV.MD](./DEVENV.MD#formatting-code-section) **Prettier** section for detailed instructions on setting up the prettier formatter on save.

This is needed to ensure consistent format throughout the project.

# IDE Project

## File Tree Loading System

This IDE features an advanced 3-stage file tree loading system designed for optimal performance and user experience.

### ⚡ Performance Features

- **Instant UI Response**: Folder opening feels instant (1-5ms)
- **Non-blocking Background Loading**: Complete project scanning without UI freezing
- **Progressive Enhancement**: UI improves as more data becomes available
- **Smart Filtering**: Automatically skips build directories and hidden files

### 🚀 Quick Start

1. **Open Folder**: Use `Ctrl+O` or File menu → Open Folder
2. **Instant Response**: See the first level immediately
3. **Progressive Loading**: Watch as the tree expands to 2 levels, then complete background loading
4. **Quick Open**: Use `Ctrl+P` to search all files (updates automatically as background loading completes)

### 🏗️ Architecture Overview

#### 3-Stage Loading Process

1. **Stage 1 (1-5ms)**: Ultra-fast single level for instant UI
2. **Stage 2 (10-50ms)**: Fast 2-level expansion with batching
3. **Stage 3 (Background)**: Complete project tree without blocking

#### Event-Driven Updates

The system uses IPC events for real-time updates:

```typescript
// Listen for background loading progress
window.electron.onTreeLoadingProgress(data => {
  console.log(
    `Loading: ${data.progress.loadedDirectories}/${data.progress.totalDirectories}`,
  );
});

// Handle completion
window.electron.onTreeLoadingComplete(data => {
  console.log('Complete tree loaded:', data.tree);
});
```

### 🔧 Quick Open (Ctrl+P) Features

- **Complete File Access**: Searches ALL files in the project
- **Progressive Discovery**: Starts with loaded files, expands automatically
- **Real-time Updates**: File list refreshes when background loading completes
- **Regex Support**: Advanced search patterns supported
- **Visual Feedback**: Shows loading status and file counts

### 📊 Performance Benchmarks

| Project Size        | Perceived Load Time | Background Complete |
| ------------------- | ------------------- | ------------------- |
| Small (< 100 files) | 2ms                 | 50ms                |
| Medium (< 1K files) | 3ms                 | 200ms               |
| Large (< 10K files) | 5ms                 | 2s                  |
| Huge (> 10K files)  | 8ms                 | 10s+                |

### 🛠️ Developer API

#### IPC Handlers

```typescript
// Get all files for quick-open
const files = await window.electron.getAllFilesForQuickOpen();

// Check background loading status
const status = await window.electron.getBackgroundLoadingStatus();

// Load directory children (lazy loading)
const children = await window.electron.loadDirectoryChildren('/path/to/dir');
```

#### Event Listeners

```typescript
// Progress updates
const removeProgressListener = window.electron.onTreeLoadingProgress(data => {
  updateProgressBar(data.progress);
});

// Initial 2-level update
const removeUpdateListener = window.electron.onTreeInitialUpdate(data => {
  refreshTreeUI(data.tree);
});

// Cleanup
removeProgressListener();
removeUpdateListener();
```

### 📚 Documentation

- **[Complete Documentation](docs/file-tree-loading-system.md)**: Detailed technical documentation
- **[Changelog](CHANGELOG.md)**: All changes and improvements
- **[API Reference](docs/file-tree-loading-system.md#ipc-api-reference)**: IPC handlers and events

### 🔧 Configuration

The system includes configurable parameters for performance tuning:

```typescript
// Performance settings (in src/index.ts)
const batchSize = 20; // Items per batch
const progressInterval = 10; // Progress update frequency
const yieldInterval = 50; // Control yielding frequency
const maxDepth = 10; // Maximum search depth
```

### 🐛 Troubleshooting

**Slow Initial Loading**:

- Check file system permissions
- Verify directory location (network drives are slower)

**Background Loading Issues**:

- Monitor console for error messages
- Use `get-background-loading-status` to check current state

**Missing Files in Quick Open**:

- Ensure background loading completed
- Check for permission errors in console

### 🎯 Future Enhancements

- Virtual scrolling for huge directories
- File system watcher for auto-refresh
- Indexed search across file contents
- Custom filtering rules
- Tree structure caching

---
