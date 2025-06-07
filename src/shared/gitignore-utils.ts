// Simple browser-compatible path utilities
const pathUtils = {
  join: (...parts: string[]): string => {
    return parts
      .filter(part => part && part !== '.')
      .join('/')
      .replace(/\/+/g, '/') // Remove duplicate slashes
      .replace(/\/$/, ''); // Remove trailing slash
  },

  relative: (from: string, to: string): string => {
    // Simple relative path calculation
    const fromParts = from.split('/').filter(p => p);
    const toParts = to.split('/').filter(p => p);

    // Find common base
    let commonLength = 0;
    for (let i = 0; i < Math.min(fromParts.length, toParts.length); i++) {
      if (fromParts[i] === toParts[i]) {
        commonLength++;
      } else {
        break;
      }
    }

    // Build relative path
    const upLevels = fromParts.length - commonLength;
    const relativeParts = toParts.slice(commonLength);

    if (upLevels === 0 && relativeParts.length === 0) {
      return '.';
    }

    return relativeParts.join('/');
  },

  basename: (filePath: string): string => {
    return filePath.split('/').pop() || '';
  },

  sep: '/' as const,
};

// Simple gitignore pattern matching
export class GitIgnoreChecker {
  private patterns: string[] = [];
  private rootPath: string = '';

  constructor(rootPath: string) {
    this.rootPath = rootPath.replace(/\\/g, '/'); // Normalize to forward slashes
  }

  // Load and parse .gitignore file
  async loadGitIgnore(): Promise<void> {
    try {
      const gitignorePath = pathUtils.join(this.rootPath, '.gitignore');

      // Try to read .gitignore file directly
      try {
        const gitignoreData = await window.electron.readFile(gitignorePath);
        if (gitignoreData && gitignoreData.content) {
          this.parseGitIgnore(gitignoreData.content);
        } else {
          this.patterns = [];
        }
      } catch (error) {
        // .gitignore doesn't exist or can't be read
        this.patterns = [];
      }
    } catch (error) {
      console.warn('Failed to load .gitignore:', error);
      this.patterns = [];
    }
  }

  // Parse gitignore content into patterns
  private parseGitIgnore(content: string): void {
    this.patterns = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#')) // Remove empty lines and comments
      .map(pattern => {
        // Handle basic gitignore patterns
        if (pattern.endsWith('/')) {
          // Directory pattern
          return pattern;
        }
        return pattern;
      });
  }

  // Check if a file/folder should be ignored
  isIgnored(filePath: string): boolean {
    // Always ignore .git folder and its contents
    const normalizedPath = filePath.replace(/\\/g, '/');
    const relativePath = pathUtils.relative(this.rootPath, normalizedPath);
    const pathParts = relativePath.split('/').filter(p => p);

    // Check for common ignored folders
    const commonIgnoredFolders = ['.git', 'node_modules', '.vscode', '.idea'];
    if (pathParts.some(part => commonIgnoredFolders.includes(part))) {
      return true;
    }

    if (!this.patterns.length) return false;

    // Normalize path separators
    const fileName = pathUtils.basename(normalizedPath);

    return this.patterns.some(pattern => {
      // Basic pattern matching (simplified gitignore implementation)
      return this.matchesPattern(relativePath, fileName, pattern);
    });
  }

  private matchesPattern(
    filePath: string,
    fileName: string,
    pattern: string,
  ): boolean {
    // Remove leading slash if present
    const cleanPattern = pattern.startsWith('/') ? pattern.slice(1) : pattern;

    // Handle directory patterns
    if (cleanPattern.endsWith('/')) {
      const dirPattern = cleanPattern.slice(0, -1);
      return filePath.includes(dirPattern) || fileName === dirPattern;
    }

    // Handle wildcards (basic implementation)
    if (cleanPattern.includes('*')) {
      const regexPattern = cleanPattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');

      try {
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(fileName) || regex.test(filePath);
      } catch {
        // Fallback to simple string matching if regex fails
        return (
          fileName.includes(cleanPattern.replace('*', '')) ||
          filePath.includes(cleanPattern.replace('*', ''))
        );
      }
    }

    // Exact match
    return (
      fileName === cleanPattern ||
      filePath === cleanPattern ||
      filePath.endsWith('/' + cleanPattern) ||
      filePath.includes('/' + cleanPattern + '/')
    );
  }

  // Get all patterns for debugging
  getPatterns(): string[] {
    return [...this.patterns];
  }
}

// Create a singleton instance that can be shared
let gitIgnoreChecker: GitIgnoreChecker | null = null;

export const getGitIgnoreChecker = (
  rootPath?: string,
): GitIgnoreChecker | null => {
  if (
    rootPath &&
    (!gitIgnoreChecker || gitIgnoreChecker['rootPath'] !== rootPath)
  ) {
    gitIgnoreChecker = new GitIgnoreChecker(rootPath);
  }
  return gitIgnoreChecker;
};

export const initializeGitIgnore = async (
  rootPath: string,
): Promise<GitIgnoreChecker> => {
  const checker = new GitIgnoreChecker(rootPath);
  await checker.loadGitIgnore();
  gitIgnoreChecker = checker;
  return checker;
};
