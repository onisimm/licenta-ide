# licenta-ide

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

## Setting Up the Development Environment (Windows)

### Desired Output

For increased readability and ease of use:

![alt text](desired_dev_env_look.png)

### 1. Configure `.gitconfig` with User Details

Set up the `.gitconfig` file in `%USERPROFILE%`.

Example configuration:

```ini
[filter "lfs"]
  smudge = git-lfs smudge -- %f
  process = git-lfs filter-process
  required = true
  clean = git-lfs clean -- %f
[user]
  name = Onisim Roman
  email = onisimroman@gmail.com
```

### 2. Configure .prettierrc

Create a .prettierrc file in %USERPROFILE% with the following configuration:

```ini
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "bracketLine": false,
  "bracketSameLine": true,
  "arrowParens": "avoid",
  "proseWrap": "never",
  "pluginSearchDirs": false,
  "htmlWhitespaceSensitivity": "css"
}
```

#### 2.1. Install Prettier Extension for VSCode

Download the extension from the [VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

#### 2.2. Set the prettier config globally in vscode

1. Open `settings.json` in VSCode:

- Press `CTRL+P` → Search for `settings.json` in `AppData/Roaming/Code/settings.json`.

2. add the following setting:

```json
"prettier.configPath": "C:\\Users\\%USERPROFILE%\\.prettierrc",
```

Change this with your full path of `%USERPROFILE/.prettierrc`

3. Enable automatic formatting:

```json
"editor.formatOnSave": true
```

### 3. Set up a pretty terminal (for windows)

#### 3.1. Download and install [powershell 7](https://github.com/PowerShell/PowerShell).

#### 3.2. Follow the installation guide on [oh-my-posh](https://ohmyposh.dev/docs/installation/windows).

#### 3.3. Set Up a Font

- Install a font such as MesloLGM Nerd Font.
- Configure the font in `settings.json` for VSCode:
  ```json
  "terminal.integrated.fontFamily": "MesloLGM Nerd Font"
  ```

#### 3.4. Set Up a Theme

1. Choose a theme (e.g., "Space Theme") from the [Oh-My-Posh website](https://ohmyposh.dev).
2. Download the theme and save it in the `%USERPROFILE%` folder.
3. Configure PowerShell to use the theme:
   - Open the PowerShell profile using:
     ```bash
     code $PROFILE
     ```
     or
     ```bash
     notepad $PROFILE
     ```
     or whatever else editor you want to use
   - Add the following line (replace `space.omp.json` with your theme file):
     ```bash
     oh-my-posh init pwsh --config ~/space.omp.json | Invoke-Expression
     ```
