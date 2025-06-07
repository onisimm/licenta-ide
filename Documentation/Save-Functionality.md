# File Save Functionality Documentation

## Overview

This document provides a comprehensive explanation of the file saving functionality in the Licenta IDE application. The save process involves multiple components working together across Electron's main and renderer processes, including Monaco Editor, React components, Redux state management, IPC communication, and file system operations.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Interface │    │   Renderer      │    │   Main Process  │
│   (Monaco)      │ ──►│   (React)       │ ──►│   (Electron)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Monaco Editor   │    │ Redux Store     │    │ File System     │
│ Content Buffer  │    │ State Mgmt      │    │ Operations      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Trigger Mechanisms

The save process can be initiated through two primary mechanisms:

### 1. Keyboard Shortcut

- **Windows/Linux**: `Ctrl+S`
- **macOS**: `Cmd+S`
- Handled directly by Monaco Editor command registration

### 2. Application Menu

- **File → Save File** menu item
- Native application menu bar integration
- Cross-platform accelerator key display

## Detailed Process Flow

### Phase 1: User Interaction Detection

#### 1.1 Keyboard Shortcut Path

```typescript
// In CodeEditor component (src/components/code-editor.tsx)
editor.addCommand(
  monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS,
  () => {
    saveFile(); // Direct function call
  },
);
```

#### 1.2 Menu Item Path

```typescript
// In main process (src/index.ts)
{
  label: 'Save File',
  accelerator: 'CmdOrCtrl+S',
  click: async () => {
    mainWindow.webContents.send('menu-save-file'); // IPC message
  }
}

// In renderer process (src/components/code-editor.tsx)
useEffect(() => {
  const unsubscribeSave = window.electron.onMenuSaveFile?.(saveFile);
  return () => unsubscribeSave?.();
}, [saveFile]);
```

### Phase 2: Pre-Save Validation

#### 2.1 Component State Validation

```typescript
const saveFile = useCallback(async () => {
  // Check if file is selected
  if (!selectedFile || !selectedFile.path) {
    console.warn('No file selected to save');
    return;
  }

  // Prevent concurrent saves
  if (isSaving) {
    console.log('Save already in progress');
    return;
  }

  // Get current content from Monaco Editor
  const currentContent = editorRef.current?.getValue();
  if (currentContent === undefined) {
    console.warn('Could not get content from editor');
    return;
  }
}, [selectedFile, isSaving, dispatch]);
```

#### 2.2 Content Extraction

- **Source**: Monaco Editor's `getValue()` method
- **Advantage**: Gets real-time content, not stale Redux state
- **Type**: String content with current editor state

### Phase 3: IPC Communication Setup

#### 3.1 Renderer to Main Process

```typescript
// In preload script (src/preload.ts)
saveFile: async (filePath: string, content: string) => {
  try {
    const result = await ipcRenderer.invoke('save-file', filePath, content);
    return result;
  } catch (error) {
    console.error('Error in saveFile preload:', error);
    throw normalizeError(error);
  }
};
```

#### 3.2 IPC Channel Registration

```typescript
// In main process (src/index.ts)
ipcMain.handle(
  'save-file',
  async (event, filePath: string, content: string) => {
    // File saving logic here
  },
);
```

### Phase 4: Main Process File Operations

#### 4.1 Input Validation

```typescript
// Validate file path
if (!filePath || typeof filePath !== 'string') {
  throw new Error('Invalid file path provided');
}

// Validate content
if (typeof content !== 'string') {
  throw new Error('Invalid file content provided');
}
```

#### 4.2 Backup Creation

```typescript
const backupPath = `${filePath}.backup`;
try {
  if (fs.existsSync(filePath)) {
    await fs.promises.copyFile(filePath, backupPath);
    console.log('💾 Backup created:', backupPath);
  }
} catch (backupError) {
  console.warn('Could not create backup:', backupError);
  // Continue with save even if backup fails
}
```

#### 4.3 File Writing

```typescript
console.log('✍️ Writing file...');
await fs.promises.writeFile(filePath, content, 'utf8').catch(writeError => {
  throw new Error(`Cannot write file content: ${writeError.message}`);
});
```

#### 4.4 Write Verification

```typescript
console.log('🔍 Verifying write...');
const writtenContent = await fs.promises.readFile(filePath, 'utf8');
console.log('📖 Written content length:', writtenContent.length);

if (writtenContent.length !== content.length) {
  throw new Error(
    `Write verification failed: expected ${content.length} chars, got ${writtenContent.length}`,
  );
}
```

#### 4.5 Backup Cleanup

```typescript
try {
  if (fs.existsSync(backupPath)) {
    await fs.promises.unlink(backupPath);
    console.log('🗑️ Backup removed');
  }
} catch (cleanupError) {
  console.warn('Could not remove backup file:', cleanupError);
  // Don't fail the save for this
}
```

### Phase 5: Response Handling

#### 5.1 Success Response

```typescript
return { success: true, path: filePath };
```

#### 5.2 Renderer-Side Verification

```typescript
if (result.success) {
  console.log('File saved successfully:', result.path);

  // Verify the save by reading the file back
  try {
    const verifyResult = await window.electron.readFile(selectedFile.path);
    if (verifyResult.content === currentContent) {
      console.log('✅ Save verified - file content matches what we saved');
    } else {
      console.error(
        '❌ Save verification failed - file content does not match',
      );
    }
  } catch (verifyError) {
    console.warn('Could not verify save:', verifyError);
  }
}
```

### Phase 6: State Synchronization

#### 6.1 Redux State Update

```typescript
// Update Redux state with the saved content to keep it in sync
dispatch(updateSelectedFileContent(currentContent));
```

#### 6.2 UI State Reset

```typescript
finally {
  setIsSaving(false); // Reset loading state
}
```

## State Management Integration

### Redux Store Structure

```typescript
interface IMainState {
  folderStructure: IFolderStructure;
  selectedFile: ISelectedFile | null; // Contains file path and content
  isLoadingFile: boolean;
}

interface ISelectedFile {
  path: string; // File system path
  name: string; // Display name
  content: string; // Current content
  language: string; // Syntax highlighting language
}
```

### State Actions

```typescript
// Real-time content tracking
updateSelectedFileContent: (state, action: PayloadAction<string>) => {
  if (state.selectedFile) {
    state.selectedFile.content = action.payload;
  }
};
```

## Error Handling Strategy

### 1. Validation Errors

- **File path validation**: Ensures valid string path
- **Content validation**: Ensures string content
- **Editor state validation**: Checks Monaco editor availability

### 2. File System Errors

- **Permission errors**: Handled with descriptive messages
- **Disk space errors**: Caught and reported
- **Path errors**: Invalid or inaccessible paths

### 3. IPC Communication Errors

- **Network timeouts**: If IPC channel fails
- **Serialization errors**: Large content or binary data
- **Process communication failures**: Main/renderer disconnect

### 4. Recovery Mechanisms

- **Backup system**: Automatic backup before save
- **Rollback capability**: Restore from backup on failure
- **User notification**: Clear error messages with context

## Debugging and Logging

### Console Output Format

```
🔄 Starting save operation...
📁 File path: /path/to/file.js
📝 Content length: 1234
📝 Content preview (first 100 chars): function example() {...
💾 Backup created: /path/to/file.js.backup
✍️ Writing file...
🔍 Verifying write...
📖 Written content length: 1234
🗑️ Backup removed
✅ File saved successfully: /path/to/file.js (1234 chars)
```

### Verification Steps

1. **Pre-save content length check**
2. **Post-write file read verification**
3. **Content comparison verification**
4. **Redux state synchronization confirmation**

## Performance Considerations

### 1. Content Size Limits

- **Current limit**: 10MB per file
- **Reason**: Memory usage and IPC serialization
- **Handling**: Large files rejected with clear error

### 2. Concurrent Save Prevention

- **Mechanism**: `isSaving` state flag
- **Purpose**: Prevent multiple simultaneous saves
- **UI feedback**: Loading spinner during save

### 3. Backup Strategy

- **Temporary backup creation**: Minimal disk impact
- **Immediate cleanup**: No persistent backup files
- **Error recovery**: Restore from backup on write failure

## Cross-Platform Compatibility

### 1. File Path Handling

- **Path normalization**: Uses Node.js `path` module
- **Separator handling**: Cross-platform path separators
- **Permission handling**: Platform-specific file permissions

### 2. Keyboard Shortcuts

- **Windows/Linux**: `Ctrl+S`
- **macOS**: `Cmd+S`
- **Implementation**: `CmdOrCtrl` modifier for cross-platform

### 3. Menu Integration

- **macOS**: Native menu bar integration
- **Windows/Linux**: Application window menu
- **Accelerator display**: Platform-appropriate key combinations

## Security Considerations

### 1. Path Validation

- **Input sanitization**: Prevents path traversal attacks
- **File type validation**: Ensures text file operations
- **Permission checking**: Validates write access

### 2. Content Validation

- **Type checking**: Ensures string content only
- **Size limits**: Prevents memory exhaustion
- **Encoding**: UTF-8 enforcement for text files

## Future Enhancement Opportunities

### 1. Auto-save Functionality

- **Periodic saves**: Every N seconds or on idle
- **Draft management**: Temporary save states
- **Recovery mechanism**: Restore unsaved changes

### 2. Save Optimization

- **Differential saves**: Only save changed portions
- **Compression**: For large file efficiency
- **Batch operations**: Multiple file saves

### 3. Collaborative Features

- **Conflict resolution**: Multiple user editing
- **Version control**: Git integration
- **Change tracking**: Real-time collaboration

## Troubleshooting Guide

### Common Issues

#### 1. Save Appears Successful But File Unchanged

- **Cause**: Stale content from Redux instead of Monaco
- **Solution**: Content now extracted directly from editor
- **Verification**: Check console logs for content length

#### 2. Permission Denied Errors

- **Cause**: Insufficient file system permissions
- **Solution**: Check file/directory permissions
- **Workaround**: Run with elevated permissions if needed

#### 3. IPC Communication Failures

- **Cause**: Main/renderer process communication issues
- **Solution**: Restart application
- **Prevention**: Proper error handling and recovery

### Diagnostic Steps

1. **Check console logs**: Look for detailed save process output
2. **Verify file permissions**: Ensure write access to target file
3. **Test with simple content**: Rule out content-specific issues
4. **Monitor Redux state**: Ensure proper state management
5. **Check Monaco editor state**: Verify editor content availability

---

_This documentation covers the complete file save functionality as implemented in the Licenta IDE application. For technical questions or improvements, refer to the source code in the specified files._
