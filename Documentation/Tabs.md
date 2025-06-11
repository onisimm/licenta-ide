# Tabbed Interface Documentation

## Overview

The IDE now supports a tabbed interface similar to VS Code, allowing multiple files to be open simultaneously. This provides a much more efficient workflow for developers working with multiple files.

## Features

### 🗂️ **Multiple File Support**

- Open multiple files simultaneously
- Each file gets its own tab
- Switch between files instantly
- Visual indication of active file

### 🎨 **Tab Interface**

- File icons in tabs for easy identification
- File names displayed with tooltips showing full path
- Active tab highlighted with primary color border
- Unsaved changes indicator (orange dot)
- Close button (X) on each tab

### ⚡ **Performance**

- Instant tab switching (no Monaco re-mounting)
- Same speed as normal file opening
- Memory efficient with persistent editor
- Fast line positioning with event-driven approach

## User Interface

### Tab Bar Layout

```
┌───────────────────────────────────────────────────────────────┐
│ [📄 file1.js] [📝 file2.md] [⚛️ component.tsx •] [📋 data.json] │
└───────────────────────────────────────────────────────────────┘
```

### Tab Components

- **File Icon**: Shows appropriate icon for file type
- **File Name**: Truncated with ellipsis if too long
- **Unsaved Indicator**: Orange dot when file has unsaved changes
- **Close Button**: X button to close individual tabs

### Visual States

- **Active Tab**: Primary color top border + darker background
- **Inactive Tab**: Transparent background
- **Hover State**: Slight background highlight
- **Unsaved Changes**: Orange dot in top-right corner

## How It Works

### Opening Files

1. **File Explorer**: Click any file to open in new tab (or switch to existing)
2. **Search Results**: Click line matches to open file at specific line
3. **Menu/Shortcuts**: Open file dialog adds files to tab system

### Tab Management

1. **Switch Tabs**: Click any tab header to switch to that file
2. **Close Tabs**: Click X button on individual tabs
3. **Close All**: Use folder close operation to close all tabs

### Keyboard Shortcuts

1. **Ctrl+S (Cmd+S)**: Save the currently active file
2. **Ctrl+W (Cmd+W)**: Close the currently active tab
3. **Ctrl+Shift+W (Cmd+Shift+W)**: Close entire folder (closes all tabs)

### Menu Operations

1. **File → Save**: Saves the currently active file
2. **File → Close File**: Closes the currently active tab
3. **File → Close Folder**: Closes all tabs and folder

### Unsaved Changes

1. **Visual Indicator**: Orange dot appears on tabs with unsaved changes
2. **Save Confirmation**: Prompted when trying to close unsaved files
3. **Auto-tracking**: Changes tracked automatically as you type
4. **Editor Indicator**: "Unsaved changes" indicator in top-right of editor

## Technical Implementation

### Redux State Structure

```typescript
interface IMainState {
  openFiles: IOpenFile[]; // Array of open files
  activeFileIndex: number; // Index of currently active file
  // ... other state
}

interface IOpenFile extends ISelectedFile {
  hasUnsavedChanges?: boolean; // Tracks unsaved state
  originalContent?: string; // Original content for comparison
}
```

### Key Actions

- `openFileInTab(file)` - Opens file in tab or switches to existing
- `switchToTab(index)` - Switches to tab at given index
- `closeTab(index)` - Closes tab at given index
- `updateActiveFileContent(content)` - Updates content and tracks changes
- `markTabAsSaved(index)` - Marks tab as saved after successful save

### Smart Tab Behavior

- **Duplicate Prevention**: Opening same file switches to existing tab
- **Active Index Management**: Automatically adjusts when tabs are closed
- **Content Tracking**: Compares against original content to detect changes

## Usage Examples

### Basic File Operations

```typescript
// Open a file in tab system
dispatch(openFileInTab(fileData));

// Switch to specific tab
dispatch(switchToTab(2));

// Close current tab
dispatch(closeTab(activeFileIndex));

// Update content and track changes
dispatch(updateActiveFileContent(newContent));
```

### Tab Component Usage

```tsx
import { TabBar } from '../components/tab-bar';

// In your content component
<ContentContainer>
  <TabBar /> {/* Automatically renders when files are open */}
  <CodeEditor />
</ContentContainer>;
```

## Integration Points

### Search Functionality

- Search results automatically open files in tabs
- Line positioning works immediately with event-driven approach
- Search context preserved while navigating between tabs

### File Explorer

- Single-click opens files in tabs
- Existing file handling switches to appropriate tab
- Folder operations affect all open tabs

### Monaco Editor

- Always mounted for maximum performance
- Content switches based on active tab
- Overlays handle loading and empty states

## User Experience Benefits

### Workflow Improvements

1. **Context Switching**: Keep multiple files accessible
2. **Reference Files**: Keep documentation/config files open
3. **Code Review**: Compare files side-by-side conceptually
4. **Development Speed**: No repeated file opening

### Visual Feedback

1. **Clear Active State**: Always know which file is active
2. **Unsaved Indicators**: Never lose track of unsaved changes
3. **File Identification**: Icons and names make files easily recognizable
4. **Path Information**: Tooltips show full file paths

## Performance Characteristics

### Metrics

- **Tab Switch Time**: ~1-5ms (instant)
- **File Opening**: Same as normal (no overhead)
- **Memory Usage**: Constant (persistent Monaco)
- **React Re-renders**: Minimal (optimized state updates)

### Optimizations

- **Persistent Monaco**: Editor never unmounts
- **Event-driven Line Positioning**: Bypasses React for maximum speed
- **Smart State Management**: Only update what's necessary
- **Efficient Rendering**: Memoized components and callbacks

## Future Enhancements

### Potential Features

1. **Tab Reordering**: Drag and drop tab reordering
2. **Tab Groups**: Group related files together
3. **Split Views**: Side-by-side file viewing
4. **Tab Context Menu**: Right-click options for tabs
5. **Keyboard Navigation**: Ctrl+Tab style navigation
6. **Tab Limits**: Configurable maximum number of open tabs

### Advanced Functionality

1. **Session Persistence**: Remember open tabs between sessions
2. **Tab Previews**: Hover previews of file content
3. **Recent Files**: Quick access to recently closed files
4. **Tab Search**: Search through open tabs
5. **Workspace Integration**: Per-workspace tab management

## Best Practices

### Development

1. **Always check active file**: Use `activeFile` instead of `selectedFile`
2. **Handle empty states**: Check for `openFiles.length > 0`
3. **Update tab content**: Use `updateActiveFileContent` for changes
4. **Mark saves properly**: Use `markTabAsSaved` after successful saves

### User Experience

1. **Provide visual feedback**: Show loading states and unsaved indicators
2. **Confirm destructive actions**: Ask before closing unsaved files
3. **Maintain context**: Preserve user's place when switching tabs
4. **Handle edge cases**: Empty states, error conditions, etc.

## Conclusion

The tabbed interface provides a professional, efficient workflow that matches user expectations from modern code editors. The implementation balances performance with functionality, ensuring that the enhanced features don't compromise the responsiveness that users expect from a code editor.

Key benefits:

- **Faster Development**: Multiple files accessible simultaneously
- **Better Organization**: Visual file management with clear indicators
- **Professional UX**: Behavior consistent with VS Code and other modern editors
- **Performance Optimized**: No compromise on speed or responsiveness
