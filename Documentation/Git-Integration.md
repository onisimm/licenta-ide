# Git Integration Documentation

## Overview

The IDE includes comprehensive Git integration in the **Source** section, providing full version control functionality directly within the editor. Users can view file changes, stage/unstage files, commit changes, and push/pull from remote repositories without leaving the IDE.

## Recent Updates & Bug Fixes

### **Fixed Issues**

- **Branch line parsing bug**: Fixed issue where branch status lines (e.g., `## staging...origin/staging`) were incorrectly parsed as file entries
- **Enhanced Git commands**: Improved staging/unstaging commands with better error handling and modern Git syntax support
- **Better file path handling**: Added proper quoting for file paths with spaces and special characters
- **Improved UI feedback**: Enhanced staging/unstaging buttons with better visual feedback and tooltips

### **Technical Improvements**

- **Git status parsing**: Added proper filtering to skip branch status lines starting with `##`
- **Command compatibility**: Added fallback from modern Git commands (`git restore`) to older syntax (`git reset`) for better compatibility
- **Enhanced debugging**: Added comprehensive logging for Git operations to help troubleshoot issues
- **UI enhancements**: Improved staging buttons with clear visual states (+ for staging, - for unstaging)

## Features

### 🔍 **Git Status Monitoring**

- **Real-time status checking** of all files in the repository
- **File change detection** (modified, added, deleted, untracked, renamed)
- **Branch information** display with ahead/behind tracking
- **Clean repository detection** when no changes exist

### 📁 **File Staging Management**

- **Individual file staging/unstaging** with single-click operation
- **Bulk operations** for staging or unstaging all files at once
- **Visual status indicators** showing staged vs unstaged files
- **Collapsible sections** for organized file management

### 💾 **Commit Operations**

- **Commit message composition** with multi-line support
- **Staged files validation** before committing
- **Automatic status refresh** after successful commits
- **Commit success/failure feedback**

### 🌐 **Remote Repository Operations**

- **Push functionality** to origin remote
- **Pull functionality** from origin remote
- **Branch tracking** with ahead/behind counts
- **Conditional UI** showing push/pull buttons only when needed

## User Interface

### **Branch Information Panel**

```
[Git Icon] main ↑2 ↓0 [Refresh]
```

- Shows current branch name
- Displays commits ahead of remote (↑2)
- Displays commits behind remote (↓0)
- Refresh button to update status

### **Action Buttons**

- **Pull Button**: Appears when commits are behind remote
- **Push Button**: Appears when commits are ahead of remote
- **Stage All/Unstage All**: Bulk operations for file management

### **File Sections**

#### Changes (Unstaged)

```
▼ Changes (3) [+]
  ○ M src/component.tsx
  ○ A src/new-file.ts
  ○ D old-file.js
```

#### Staged Changes

```
▼ Staged Changes (2) [-]
  ● M README.md
  ● A docs/guide.md
```

### **Commit Section**

```
┌─────────────────────────────────┐
│ Commit message                  │
│                                 │
└─────────────────────────────────┘
[Commit] (disabled if no message)
```

## Technical Architecture

### **Component Structure**

```
SourceSection (React Component)
├── Branch Info Display
├── Action Buttons (Push/Pull)
├── File List Container
│   ├── Changes Section (Unstaged)
│   └── Staged Changes Section
└── Commit Section
```

### **State Management**

```typescript
interface GitStatus {
  files: GitFileStatus[];
  branch: string;
  ahead: number;
  behind: number;
  isClean: boolean;
}

interface GitFileStatus {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked';
  staged: boolean;
}
```

### **IPC Communication**

| Handler Name | Purpose | Parameters | Return Type |
| --- | --- | --- | --- |
| `get-git-status` | Get repository status | `folderPath: string` | `GitStatus \| null` |
| `get-git-branch` | Get branch information | `folderPath: string` | `GitBranchInfo \| null` |
| `git-stage-file` | Stage single file | `folderPath, filePath` | `{ success: true }` |
| `git-unstage-file` | Unstage single file | `folderPath, filePath` | `{ success: true }` |
| `git-stage-all` | Stage all files | `folderPath: string` | `{ success: true }` |
| `git-unstage-all` | Unstage all files | `folderPath: string` | `{ success: true }` |
| `git-commit` | Commit staged files | `folderPath, message` | `{ success: true }` |
| `git-push` | Push to remote | `folderPath: string` | `{ success: true }` |
| `git-pull` | Pull from remote | `folderPath: string` | `{ success: true }` |

## Workflow Examples

### **Basic File Staging and Commit**

1. **Open Source section** - Click on Git icon in sidebar
2. **View changes** - See unstaged files in "Changes" section
3. **Stage files** - Click circle icon next to files to stage
4. **Write commit message** - Type in commit message box
5. **Commit** - Click "Commit" button
6. **Push** - Click "Push" button if available

### **Pull Latest Changes**

1. **Check branch status** - Look for "↓X" indicator showing behind commits
2. **Click Pull button** - Button appears automatically when behind
3. **View updated status** - Status refreshes automatically

### **Bulk Operations**

1. **Stage all changes** - Click "+" icon in Changes section header
2. **Unstage all files** - Click "-" icon in Staged Changes section header
3. **Review before commit** - Verify staged files before committing

## Error Handling

### **Repository Detection**

- **Not a Git repository**: Shows initialization option
- **No folder opened**: Displays folder selection prompt
- **Loading states**: Shows spinner during operations

### **Operation Failures**

- **Permission errors**: Console logging with user feedback
- **Network issues**: Handled gracefully for push/pull operations
- **Merge conflicts**: Detailed error messages displayed

### **State Recovery**

- **Automatic refresh** after each operation
- **Consistent state** maintained across operations
- **Error logging** for debugging purposes

## File Status Indicators

### **Status Chips**

| Letter | Status    | Color  | Description                  |
| ------ | --------- | ------ | ---------------------------- |
| **M**  | Modified  | Orange | File has been changed        |
| **A**  | Added     | Green  | New file added to repository |
| **D**  | Deleted   | Red    | File has been removed        |
| **U**  | Untracked | Blue   | New file not yet tracked     |
| **R**  | Renamed   | Purple | File has been renamed        |

### **Staging Icons**

| Icon  | State    | Action                |
| ----- | -------- | --------------------- |
| **○** | Unstaged | Click to stage file   |
| **●** | Staged   | Click to unstage file |

## Performance Considerations

### **Efficient Status Checking**

- **Git command optimization** using `--porcelain` flags
- **Minimal data parsing** for status information
- **Cached repository detection** to avoid repeated checks

### **UI Responsiveness**

- **Async operations** prevent UI blocking
- **Loading indicators** during long operations
- **Optimistic updates** where appropriate

### **Memory Management**

- **Lean state structure** with minimal data
- **Automatic cleanup** of event listeners
- **Efficient re-rendering** with React.memo

## Integration with Other Features

### **File Tree Integration**

- **Git status markers** could be added to file tree (future enhancement)
- **Ignored files handling** respects .gitignore patterns
- **Real-time updates** when files change

### **Search Integration**

- **Git ignored files** excluded from search by default
- **Branch-specific searches** possible (future enhancement)
- **Commit message search** integration potential

### **Editor Integration**

- **Diff viewing** capabilities (future enhancement)
- **Blame annotations** possibility (future enhancement)
- **Merge conflict resolution** tools (future enhancement)

## Configuration Options

### **Git Settings**

```typescript
// Future configuration possibilities
interface GitConfig {
  autoRefresh: boolean;
  showIgnoredFiles: boolean;
  defaultCommitMessageTemplate: string;
  pushBehavior: 'always' | 'confirm' | 'never';
}
```

### **UI Preferences**

- **Section expansion states** persisted
- **File grouping preferences** (by status, alphabetical)
- **Compact vs detailed view** options

## Troubleshooting

### **Common Issues**

**Git not found in PATH:**

```bash
# Ensure Git is installed and in PATH
git --version
```

**Permission denied on operations:**

```bash
# Check repository permissions
ls -la .git/
```

**Remote repository not configured:**

```bash
# Set up remote origin
git remote add origin <repository-url>
```

### **Debug Information**

- **Console logging** for all Git operations
- **Error details** displayed in UI where appropriate
- **Status refresh timing** logged for performance monitoring

## Future Enhancements

### **Planned Features**

- **Diff viewing** for individual files
- **Commit history** browsing
- **Branch switching** and creation
- **Merge conflict resolution** tools
- **Git stash** management
- **Remote branch tracking**

### **Advanced Features**

- **Interactive rebase** support
- **Git flow** integration
- **Submodule** support
- **Git hooks** management
- **Custom Git commands**

## Security Considerations

### **Command Injection Prevention**

- **Parameterized commands** using proper escaping
- **Input validation** for commit messages and file paths
- **Secure execution** in isolated working directories

### **Credential Management**

- **System credential storage** utilized
- **No credential caching** in application
- **SSH key integration** supported through system Git

This comprehensive Git integration transforms the IDE into a complete development environment with full version control capabilities! 🚀
