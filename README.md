# licenta-ide

## Commit style

I suggest using git cz for consistent and readable commits https://www.npmjs.com/package/git-cz

Use the id of the issue before the commit. e.g: `#632 add search bar functionality` / `#632 fix search bar invisible text` / `#632 add search bar uts`

## Setting up dev env

Desired output, for increased readability and ease of use:

![alt text](desired_dev_env_look.png)

### 1. Set .gitconfig with user and password

in `%userprofile%`

e.g:

```[filter "lfs"]
	smudge = git-lfs smudge -- %f
	process = git-lfs filter-process
	required = true
	clean = git-lfs clean -- %f
[user]
	name = Onisim Roman
	email = onisimroman@gmail.com
```

### 2. /.prettierrc config

e.g configuration in `%userprofile%/.prettierrc`

```
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

#### 2.1. Get the prettier vscode extension

https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

#### 2.2. Set the prettier config globally in vscode

1. open `settings.json` in vscode

- CTRL+P -> `settings.json` in appdata/roaming/code/settings.json

2. add this setting: `"prettier.configPath": "C:\\Users\\%USERPROFILE%\\.prettierrc",`

- Change this with your full path of `%USERPROFILE/.prettierrc`

3. I also suggest having `"editor.formatOnSave": true`

### 3. Set up a pretty terminal (for windows)

1. get powershell 7 (https://github.com/PowerShell/PowerShell)
2. install oh-my-posh (https://ohmyposh.dev/docs/installation/windows)
3. set up a font (i currently have MesloLGM Nerd Font)

- also set it up in settings.json for vscode
- add this `"terminal.integrated.fontFamily": "MesloLGM Nerd Font"` with your font

4. set up a theme (personally i enjoy space theme)

- download the theme from the oh-my-posh page
- put it in the `%USERPROFILE% folder`
- in powershell, open the powershell profile: `code $PROFILE` or `notepad $PROFILE` or whatever
- add this: `oh-my-posh init pwsh --config ~/space.omp.json | Invoke-Expression` and change the filename with your theme filename
