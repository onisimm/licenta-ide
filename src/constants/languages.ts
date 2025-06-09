// Language and file extension constants
// Consolidated from multiple locations in the codebase for reusability

export interface LanguageMapping {
  extension: string;
  language: string;
  monacoLanguage?: string;
  hasIcon?: boolean;
}

// Comprehensive language mapping - combines all extensions found across the codebase
export const LANGUAGE_EXTENSION_MAP: Record<string, string> = {
  // JavaScript & TypeScript
  '.js': 'javascript',
  '.jsx': 'jsx',
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.mjs': 'javascript',
  '.cjs': 'javascript',

  // Web technologies
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',
  '.styl': 'stylus',

  // Data formats
  '.json': 'json',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.toml': 'toml',
  '.ini': 'ini',
  '.cfg': 'ini',
  '.conf': 'ini',
  '.properties': 'properties',

  // Documentation
  '.md': 'markdown',
  '.markdown': 'markdown',
  '.mdx': 'mdx',
  '.txt': 'plaintext',
  '.log': 'plaintext',
  '.readme': 'plaintext',

  // Programming languages
  '.py': 'python',
  '.pyw': 'python',
  '.pyx': 'python',
  '.java': 'java',
  '.c': 'c',
  '.cpp': 'cpp',
  '.cxx': 'cpp',
  '.cc': 'cpp',
  '.h': 'c',
  '.hpp': 'cpp',
  '.hxx': 'cpp',
  '.cs': 'csharp',
  '.php': 'php',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.swift': 'swift',
  '.kt': 'kotlin',
  '.kts': 'kotlin',
  '.scala': 'scala',
  '.r': 'r',
  '.R': 'r',
  '.dart': 'dart',
  '.lua': 'lua',
  '.pl': 'perl',
  '.pm': 'perl',

  // Shell scripts
  '.sh': 'shell',
  '.bash': 'shell',
  '.zsh': 'shell',
  '.fish': 'shell',
  '.ps1': 'powershell',
  '.psm1': 'powershell',
  '.psd1': 'powershell',

  // Database
  '.sql': 'sql',
  '.mysql': 'sql',
  '.pgsql': 'sql',
  '.sqlite': 'sql',

  // DevOps & Config
  '.dockerfile': 'dockerfile',
  '.dockerignore': 'dockerfile',
  '.gitignore': 'plaintext',
  '.gitattributes': 'plaintext',
  '.eslintrc': 'json',
  '.prettierrc': 'json',
  '.babelrc': 'json',
  '.env': 'plaintext',
  '.env.local': 'plaintext',
  '.env.development': 'plaintext',
  '.env.production': 'plaintext',

  // Frontend frameworks
  '.vue': 'vue',
  '.svelte': 'svelte',
  '.astro': 'astro',

  // Build tools
  '.webpack.js': 'javascript',
  '.rollup.js': 'javascript',
  '.vite.config.js': 'javascript',
  '.vite.config.ts': 'typescript',

  // Package managers
  '.package.json': 'json',
  '.yarn.lock': 'yaml',
  '.pnpm-lock.yaml': 'yaml',
};

// Monaco editor language mapping (for code editor)
export const MONACO_LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  jsx: 'javascript', // Use javascript for JSX
  tsx: 'typescript', // Use typescript for TSX
  json: 'json',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'scss', // Monaco uses scss for sass
  less: 'less',
  xml: 'xml',
  yaml: 'yaml',
  markdown: 'markdown',
  python: 'python',
  java: 'java',
  csharp: 'csharp',
  cpp: 'cpp',
  c: 'c',
  php: 'php',
  ruby: 'ruby',
  go: 'go',
  rust: 'rust',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  shell: 'shell',
  powershell: 'powershell',
  sql: 'sql',
  dockerfile: 'dockerfile',
  plaintext: 'plaintext',
  vue: 'html', // Monaco doesn't have native Vue support
  svelte: 'html', // Monaco doesn't have native Svelte support
  astro: 'html', // Monaco doesn't have native Astro support
  r: 'r',
  dart: 'dart',
  lua: 'lua',
  perl: 'perl',
  toml: 'ini', // Monaco uses ini for toml
  stylus: 'css',
  mdx: 'markdown',
  properties: 'ini',
};

// Text file extensions for search functionality
export const TEXT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
  '.json',
  '.html',
  '.htm',
  '.css',
  '.scss',
  '.sass',
  '.less',
  '.styl',
  '.xml',
  '.yaml',
  '.yml',
  '.toml',
  '.ini',
  '.cfg',
  '.conf',
  '.properties',
  '.md',
  '.markdown',
  '.mdx',
  '.txt',
  '.log',
  '.readme',
  '.py',
  '.pyw',
  '.pyx',
  '.java',
  '.c',
  '.cpp',
  '.cxx',
  '.cc',
  '.h',
  '.hpp',
  '.hxx',
  '.cs',
  '.php',
  '.rb',
  '.go',
  '.rs',
  '.rust',
  '.swift',
  '.kt',
  '.kts',
  '.scala',
  '.r',
  '.R',
  '.dart',
  '.lua',
  '.pl',
  '.pm',
  '.sh',
  '.bash',
  '.zsh',
  '.fish',
  '.ps1',
  '.psm1',
  '.psd1',
  '.sql',
  '.mysql',
  '.pgsql',
  '.sqlite',
  '.dockerfile',
  '.dockerignore',
  '.gitignore',
  '.gitattributes',
  '.eslintrc',
  '.prettierrc',
  '.babelrc',
  '.env',
  '.vue',
  '.svelte',
  '.astro',
]);

// File extensions that have associated icons
export const ICON_EXTENSIONS = new Set([
  'js',
  'ts',
  'jsx',
  'tsx',
  'json',
  'css',
  'scss',
  'sass',
  'html',
  'htm',
  'md',
  'markdown',
  'less',
  'xml',
  'yml',
  'yaml',
  'py',
  'java',
  'cs',
  'cxx',
  'cc',
  'h',
  'hpp',
  'cpp',
  'c',
  'rb',
  'php',
  'go',
  'rs',
  'swift',
  'kt',
  'scala',
  'sh',
  'ps1',
  'sql',
  'dockerfile',
  'txt',
]);

// Helper functions
export const getLanguageFromFileName = (fileName: string): string => {
  const extension = fileName.toLowerCase();
  const ext = extension.startsWith('.')
    ? extension
    : `.${extension.split('.').pop()}`;
  return LANGUAGE_EXTENSION_MAP[ext] || 'plaintext';
};

export const getMonacoLanguage = (language: string): string => {
  return MONACO_LANGUAGE_MAP[language] || 'plaintext';
};

export const isTextFile = (fileName: string): boolean => {
  const extension = fileName.toLowerCase();
  const ext = extension.startsWith('.')
    ? extension
    : `.${extension.split('.').pop()}`;
  return TEXT_EXTENSIONS.has(ext);
};

export const hasFileIcon = (fileName: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? ICON_EXTENSIONS.has(extension) : false;
};

// Get file extension without dot
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

// Get file extension with dot
export const getFileExtensionWithDot = (fileName: string): string => {
  const ext = getFileExtension(fileName);
  return ext ? `.${ext}` : '';
};
