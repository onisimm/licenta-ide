# Keyboard Shortcuts

This document provides a comprehensive list of keyboard shortcuts available in SEditor.

## Global Shortcuts

These shortcuts work anywhere in the application:

| Shortcut                       | Description                | Platform |
| ------------------------------ | -------------------------- | -------- |
| `Ctrl+O` / `Cmd+O`             | Open file or folder dialog | All      |
| `Ctrl+P` / `Cmd+P`             | Quick file search          | All      |
| `Ctrl+W` / `Cmd+W`             | Close current file         | All      |
| `Ctrl+Shift+W` / `Cmd+Shift+W` | Close current folder       | All      |
| `Ctrl+S` / `Cmd+S`             | Save current file          | All      |
| `Ctrl+J` / `Cmd+J`             | Open terminal              | All      |

## Navigation Shortcuts

These shortcuts help navigate between different sections of the IDE:

| Shortcut                       | Description    | Platform |
| ------------------------------ | -------------- | -------- |
| `Ctrl+Shift+E` / `Cmd+Shift+E` | Focus Explorer | All      |
| `Ctrl+Shift+S` / `Cmd+Shift+S` | Focus Search   | All      |
| `Ctrl+Shift+G` / `Cmd+Shift+G` | Focus Git      | All      |
| `Ctrl+Shift+A` / `Cmd+Shift+A` | Focus AI Chat  | All      |

## Editor Shortcuts

These shortcuts are available when the editor is focused:

| Shortcut           | Description | Platform |
| ------------------ | ----------- | -------- |
| `Ctrl+Z` / `Cmd+Z` | Undo        | All      |
| `Ctrl+Y` / `Cmd+Y` | Redo        | All      |
| `Ctrl+X` / `Cmd+X` | Cut         | All      |
| `Ctrl+C` / `Cmd+C` | Copy        | All      |
| `Ctrl+V` / `Cmd+V` | Paste       | All      |
| `Ctrl+A` / `Cmd+A` | Select All  | All      |

## Quick File Opener (Ctrl+P)

The Quick File Opener provides a fast way to search and open files:

- Type to search files (supports regex)
- Use arrow keys to navigate results
- Press `Enter` to open selected file
- Press `Escape` to close the dialog

## Terminal Shortcuts

When the terminal is focused:

| Shortcut           | Description        | Platform |
| ------------------ | ------------------ | -------- |
| `Ctrl+C` / `Cmd+C` | Copy selected text | All      |
| `Ctrl+V` / `Cmd+V` | Paste text         | All      |
| `Ctrl+L` / `Cmd+L` | Clear terminal     | All      |

## Notes

- On macOS, use `Cmd` instead of `Ctrl`
- Some shortcuts may be overridden by the operating system
- The IDE respects system-level keyboard shortcuts
- All shortcuts can be triggered from the menu bar as well

## Implementation Details

The keyboard shortcuts are implemented using a combination of:

1. Global event listeners in the main component
2. Monaco editor command bindings
3. Electron menu accelerators
4. Component-specific event handlers

The shortcuts are designed to be consistent with common IDE patterns and follow platform-specific conventions.
