# Search Functionality Documentation

## Overview

The Search functionality provides a powerful, fast, and user-friendly way to find text across all files in an opened project folder. It's designed to be responsive, efficient, and visually consistent with the rest of the IDE interface. **New in this version**: Search state is fully persistent when switching between sidebar sections, ensuring a seamless user experience.

## Key Features

### 🔍 **Intelligent Text Search**

- **Literal Text Matching**: Searches for exact text matches across all supported file types
- **Case-Insensitive**: Finds matches regardless of capitalization
- **Real-time Results**: Shows results as you type with intelligent debouncing
- **Performance Metrics**: Displays search duration and file statistics

### 🎨 **File Tree-Style Interface**

- **Consistent Design**: Matches the file explorer's visual style and behavior
- **Expandable Results**: Click file headers to expand/collapse matching lines
- **File Icons**: Shows appropriate icons for each file type
- **Hierarchical Display**: Files at the top level, matching lines indented below

### 💾 **State Persistence** _(New Feature)_

- **Persistent Search Results**: Search results remain visible when switching to Explorer and back
- **Query Preservation**: Search input text is maintained across sidebar section changes
- **Expansion State Memory**: File expansion/collapse states are preserved
- **Session Continuity**: Work context is never lost when navigating between sections
- **Redux State Management**: All search state is managed through Redux for reliability

### ⚡ **Advanced Performance Optimization**

- **Search Cancellation**: Automatically cancels previous searches when new input is entered
- **Debounced Input**: 400ms delay prevents excessive search requests while typing
- **Non-blocking Operations**: Search runs asynchronously without freezing the UI
- **Smart File Filtering**: Only searches relevant text files, skips binaries and large files
- **Git Integration**: Automatically respects .gitignore files to skip irrelevant files

## How It Works

### **User Workflow**

1. **Navigate to Search**: Click the search icon in the sidebar or use keyboard shortcuts
2. **Enter Search Query**: Type your search term in the input field
3. **View Results**: Results appear automatically with file grouping and match counts
4. **Explore Matches**:
   - Click file headers to expand/collapse line results
   - Click individual lines to open the file at that specific line
5. **Navigate to Code**: Files open in the main editor with automatic scrolling to the matched line
6. **Switch Sections Freely**: Navigate to Explorer or other sections - your search results will be waiting when you return

### **State Persistence Workflow** _(New Feature)_

#### **Seamless Section Switching**

1. **Perform Search**: Enter a search query and view results with expanded files
2. **Switch to Explorer**: Click the Explorer icon to view your project files
3. **Navigate Project**: Browse folders, open files, work with your project structure
4. **Return to Search**: Click the Search icon again
5. **Resume Work**: Find your search query intact, results preserved, and expansion states maintained

#### **What Gets Preserved**

- **Search Query**: The exact text you searched for remains in the input field
- **Search Results**: All found matches and file groupings stay exactly as they were
- **File Expansion States**: Files that were expanded/collapsed remain in the same state
- **Error States**: Any search errors are preserved until you start a new search
- **Loading States**: Proper loading indicators if a search was in progress

### **Search Process**

#### **Input Processing**

- User types in the search input field
- System waits 400ms after typing stops (debouncing)
- Previous searches are automatically cancelled if still running
- New search begins with a unique identifier for tracking
- **State is saved to Redux immediately** for persistence

#### **File Discovery**

- Recursively scans the opened project folder
- Loads and parses .gitignore files from the root and subdirectories
- Applies intelligent filtering to exclude:
  - Files and directories matching .gitignore patterns
  - Hidden files and folders (starting with `.`)
  - Common build directories (`node_modules`, `dist`, `build`, etc.)
  - Binary files and very large files (>50MB)
  - Non-text file types

#### **Content Analysis**

- Reads file contents in parallel batches for optimal performance
- Processes files in groups of 10 simultaneously
- Escapes special characters in search terms for literal matching
- Tracks line numbers and match counts for each file

#### **Result Organization**

- Groups matches by file with total counts
- Sorts files alphabetically for consistent ordering
- Limits matches per file (100 max) to prevent overwhelming results
- Calculates performance statistics (duration, files processed)
- **Stores all results in Redux state** for cross-section persistence

## Efficiency Features

### **Search Cancellation System**

Every search operation gets a unique ID. When a new search starts:

- The system cancels any pending previous search
- Results from outdated searches are ignored
- Only the most recent search results are displayed
- Prevents race conditions and outdated results

### **State Management Architecture** _(New Implementation)_

#### **Redux-Based Persistence**

The search functionality uses Redux for comprehensive state management:

- **Search Query State**: `searchState.query` - Preserves the current search input
- **Results State**: `searchState.results` - Maintains all search results and metadata
- **Loading State**: `searchState.isSearching` - Tracks search operation status
- **Error State**: `searchState.error` - Preserves error messages until resolution
- **Expansion State**: `searchState.expandedFiles` - Array of expanded file paths

#### **Action Creators**

- `setSearchQuery(query)` - Updates the search input text
- `setSearchResults(results)` - Stores search results and metadata
- `setSearchLoading(boolean)` - Controls loading state display
- `setSearchError(error)` - Manages error state and messages
- `setSearchExpandedFiles(paths[])` - Bulk updates file expansion states
- `toggleSearchFileExpansion(path)` - Toggles individual file expansion
- `clearSearchState()` - Resets all search state when needed

#### **Benefits of Redux Implementation**

- **Reliable Persistence**: State survives component unmounting/remounting
- **Predictable Updates**: All state changes go through Redux reducers
- **Developer Tools**: Redux DevTools support for debugging state changes
- **Performance**: Efficient re-renders only when relevant state changes
- **Scalability**: Easy to extend with additional search features

### **Smart Resource Management**

- **Gitignore Respect**: Automatically loads and respects .gitignore patterns from project root and subdirectories
- **File Size Limits**: Skips files larger than 50MB to prevent memory issues
- **Batch Processing**: Searches files in parallel batches to optimize I/O
- **Depth Limiting**: Prevents infinite recursion in deeply nested directories
- **Memory Efficiency**: Processes results incrementally rather than loading everything

### **Performance Optimizations**

- **Async Operations**: Search doesn't block the main UI thread
- **Selective Scanning**: Only searches relevant file types
- **Early Termination**: Stops processing when search is cancelled
- **Efficient Algorithms**: Uses optimized regex for pattern matching

## User Interface Design

### **Search Input**

- Clean, minimal design with search icon
- Placeholder text guides user interaction
- Real-time feedback during search operations
- Error display for failed searches
- **Persistent Value**: Input text is preserved when switching sections

### **Results Display**

- **File Headers**: Show file name, icon, and match count
- **Expandable Sections**: Click headers to show/hide line results
- **Line Results**: Display line numbers and highlighted content
- **Match Highlighting**: Found text appears with colored background
- **Performance Info**: Shows search duration and file statistics
- **Persistent Expansion**: File expansion states are maintained across section switches

### **Interactive Elements**

- **File Expansion**: Rotating arrow icons indicate expand/collapse state
- **Clickable Lines**: Each result line opens the file at that location
- **Hover Effects**: Visual feedback for interactive elements
- **Keyboard Accessible**: Supports standard navigation patterns
- **Enhanced Line Navigation**: Improved timing for scrolling to specific lines in files

#### **Improved File Navigation** _(Enhanced Feature)_

When clicking on a search result line:

1. **File Opening**: Opens the target file in the main editor
2. **Smart Timing**: 150ms delay ensures editor is ready for the new content
3. **Precise Scrolling**: Scrolls to the exact line number with retry logic
4. **Line Highlighting**: Temporarily selects the target line for visibility
5. **Robust Handling**: Verifies editor model is ready before attempting to scroll

## Visual Consistency

### **File Tree Integration**

The search results are designed to feel like a natural extension of the file explorer:

- **Identical Styling**: Uses the same fonts, colors, and spacing
- **Consistent Icons**: File type icons match those in the file tree
- **Similar Interactions**: Expand/collapse behavior mirrors folder navigation
- **Unified Design Language**: Maintains visual coherence across the IDE

### **Responsive Design**

- **Scrollable Results**: Long result lists scroll within the search panel
- **Flexible Layout**: Adapts to different panel sizes
- **Efficient Space Usage**: Compact design maximizes visible results
- **Clear Hierarchy**: Visual distinction between files and line matches

## Search Scope and Limitations

### **Supported File Types**

The search covers a comprehensive range of text-based files:

- **Programming Languages**: JavaScript, TypeScript, Python, Java, C/C++, C#, PHP, Ruby, Go, Rust, Swift, Kotlin, Scala
- **Web Technologies**: HTML, CSS, SCSS, LESS, JSON, XML, YAML
- **Documentation**: Markdown, plain text files
- **Configuration**: Environment files, config files, shell scripts
- **Development Tools**: Dockerfiles, Git files, linter configs

### **Excluded Content**

For performance and relevance, certain files are skipped:

- **Gitignored Files**: Files and directories matching patterns in .gitignore files
- **Binary Files**: Images, executables, compiled code
- **Large Files**: Files exceeding 50MB size limit
- **Hidden Directories**: `.git`, `.svn`, system folders
- **Build Artifacts**: `node_modules`, `dist`, `build`, `target` directories
- **Cache Folders**: `__pycache__`, temporary directories

## Git Integration

### **Automatic .gitignore Support**

The search functionality seamlessly integrates with Git workflows by automatically respecting .gitignore files:

- **Root .gitignore**: Loads patterns from the project root's .gitignore file
- **Nested .gitignore**: Recursively discovers and applies .gitignore files in subdirectories
- **Pattern Matching**: Uses the same gitignore pattern matching rules as Git itself
- **Performance Boost**: Skipping gitignored files significantly improves search speed
- **Developer-Focused**: Only searches files that are actually part of your project

### **How It Works**

1. **Discovery**: When search starts, the system scans for .gitignore files
2. **Loading**: Reads and parses all .gitignore files in the project hierarchy
3. **Pattern Processing**: Converts gitignore patterns to work with the search system
4. **Filtering**: Each file and directory is checked against gitignore patterns
5. **Exclusion**: Gitignored items are skipped entirely during the search process

### **Benefits**

- **Faster Searches**: No time wasted searching through irrelevant files
- **Cleaner Results**: Only shows matches in files you actually work with
- **Automatic Updates**: Changes to .gitignore files are respected in real-time
- **Zero Configuration**: Works out of the box with any Git repository

## Technical Architecture

### **Multi-Process Design**

- **Main Process**: Handles file system operations and search logic
- **Renderer Process**: Manages UI updates and user interactions
- **IPC Communication**: Secure message passing between processes
- **Async Processing**: Non-blocking operations throughout the pipeline

### **State Management** _(Redesigned Architecture)_

#### **Redux Store Structure**

```typescript
interface MainState {
  // ... other state
  searchState: {
    query: string; // Current search input
    results: SearchResults | null; // Complete search results
    isSearching: boolean; // Loading state
    error: string | null; // Error messages
    expandedFiles: string[]; // Array of expanded file paths
  };
  sidebarState: {
    explorerExpanded: boolean; // Explorer section state
  };
}
```

#### **Component Integration**

- **Search Component**: Connects to Redux state via useAppSelector hooks
- **State Updates**: Uses Redux actions for all state modifications
- **Effect Management**: useEffect hooks sync with Redux state changes
- **Persistence Layer**: Redux automatically handles state persistence

#### **Cross-Component Benefits**

- **Explorer Integration**: Explorer expansion states also persist using the same pattern
- **Shared Architecture**: Consistent state management across all sidebar sections
- **Future Extensibility**: Easy to add persistence for additional sections

### **Performance Tracking**

- **Search Duration**: Monitors search duration and resource usage
- **Cancellation Tracking**: Maintains search ID system for request management
- **Memory Usage**: Efficient state updates minimize memory footprint

## Integration with IDE Features

### **Sidebar Ecosystem** _(New Integration)_

The search functionality now integrates seamlessly with the entire sidebar ecosystem:

#### **Explorer Integration**

- **Shared State Pattern**: Both Search and Explorer use Redux for state persistence
- **Consistent UX**: Same expansion behavior and visual feedback across sections
- **Cross-Section Navigation**: Switch freely between sections without losing context

#### **Future Section Support**

The state persistence architecture is designed to support additional sidebar sections:

- **Source Control**: Git status and changes could be persistent
- **Extensions**: Third-party extensions can use the same state pattern
- **Settings**: Configuration panels could maintain their state
- **Debug**: Debug session information could persist across navigation

## Future Enhancements

### **Potential Improvements**

- **Search History**: Remember recent search terms with dropdown suggestions
- **Advanced Filters**: File type, date, size filtering options
- **Search and Replace**: Bulk text replacement functionality across multiple files
- **Regex Support**: Optional regular expression pattern matching
- **Search Scope**: Limit search to specific folders or file types
- **Keyboard Shortcuts**: Quick access and navigation hotkeys
- **Search Bookmarks**: Save and recall frequently used searches
- **Collaborative Search**: Share search results with team members

### **Performance Optimizations**

- **Indexing**: Pre-build search indexes for faster subsequent searches
- **Incremental Search**: Update results as file contents change
- **Caching**: Store recent search results for quick re-access
- **Worker Threads**: Further parallelize search operations
- **Smart Prefetching**: Anticipate likely searches based on usage patterns

### **State Management Extensions**

- **Local Storage Backup**: Persist critical state to local storage for session recovery
- **Search Analytics**: Track search patterns to improve the experience
- **Workspace Integration**: Save search state per workspace/project
- **Cloud Sync**: Synchronize search preferences across devices

## Developer Experience

### **Debugging and Development**

The Redux-based architecture provides excellent developer experience:

- **Redux DevTools**: Full state inspection and time-travel debugging
- **Action Logging**: Every state change is logged and traceable
- **Predictable Behavior**: Pure functions make testing and debugging easier
- **Performance Monitoring**: Easy to track re-renders and optimize performance

### **Code Organization**

- **Centralized State**: All search logic in dedicated Redux slice
- **Type Safety**: Full TypeScript support for all state interfaces
- **Modular Actions**: Each state change has a dedicated action creator
- **Reusable Patterns**: State persistence pattern can be applied to new features

## Conclusion

The enhanced search functionality provides a robust, efficient, and persistent way to explore code within projects. The new **state persistence feature** fundamentally improves the developer experience by eliminating the frustration of lost search context when navigating between IDE sections.

Key improvements include:

- **Seamless Navigation**: Switch between Search and Explorer without losing your place
- **Persistent Context**: Search results, queries, and expansion states are never lost
- **Professional UX**: Behavior that matches expectations from professional IDEs
- **Scalable Architecture**: Redux-based state management supports future enhancements
- **Enhanced File Navigation**: Improved timing and reliability when opening files from search results

The combination of performance optimizations, intuitive interface design, visual consistency, and robust state management makes this a powerful tool for developers working with large codebases. The system balances speed, accuracy, usability, and persistence to deliver a professional-grade search experience that integrates seamlessly with the overall IDE environment.

This implementation sets the foundation for a truly persistent and user-friendly IDE experience where developers can focus on their code rather than managing tool state.
