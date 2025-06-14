import { ipcMain } from 'electron';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  isGitRepository,
  parseGitStatus,
  parseGitBranch,
} from '../utils/gitUtils';

const execAsync = promisify(exec);

export const registerGitHandlers = () => {
  ipcMain.handle('check-git-repo', async (event, folderPath: string) => {
    try {
      console.log('🔍 Checking if folder is a Git repository:', folderPath);
      const isGit = await isGitRepository(folderPath);
      console.log('✅ Git repository check result:', isGit);
      return isGit;
    } catch (error) {
      console.error('❌ Error checking Git repository:', error);
      return false;
    }
  });

  ipcMain.handle('get-git-status', async (event, folderPath: string) => {
    try {
      console.log('📊 Getting Git status for:', folderPath);

      if (!folderPath) {
        throw new Error('No folder path provided');
      }

      const isGit = await isGitRepository(folderPath);
      if (!isGit) {
        throw new Error('Not a Git repository');
      }

      const { stdout: statusOutput } = await execAsync(
        'git status --porcelain',
        {
          cwd: folderPath,
        },
      );

      const { stdout: branchOutput } = await execAsync('git branch -v', {
        cwd: folderPath,
      });

      const fileStatuses = parseGitStatus(statusOutput);
      const branchInfo = parseGitBranch(branchOutput);

      console.log('✅ Git status retrieved successfully');
      return {
        files: fileStatuses,
        branch: branchInfo.current,
        ahead: branchInfo.ahead,
        behind: branchInfo.behind,
      };
    } catch (error) {
      console.error('❌ Error getting Git status:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error getting Git status';

      throw new Error(`Failed to get Git status: ${errorMessage}`);
    }
  });

  ipcMain.handle(
    'git-stage',
    async (event, folderPath: string, filePath: string) => {
      try {
        console.log('📝 Staging file:', filePath);

        if (!folderPath || !filePath) {
          throw new Error('Invalid folder or file path provided');
        }

        const isGit = await isGitRepository(folderPath);
        if (!isGit) {
          throw new Error('Not a Git repository');
        }

        await execAsync(`git add "${filePath}"`, { cwd: folderPath });

        console.log('✅ File staged successfully:', filePath);
        return { success: true, path: filePath };
      } catch (error) {
        console.error('❌ Error staging file:', filePath, error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'Unknown error staging file';

        throw new Error(`Failed to stage file: ${errorMessage}`);
      }
    },
  );

  ipcMain.handle(
    'git-unstage',
    async (event, folderPath: string, filePath: string) => {
      try {
        console.log('↩️ Unstaging file:', filePath);

        if (!folderPath || !filePath) {
          throw new Error('Invalid folder or file path provided');
        }

        const isGit = await isGitRepository(folderPath);
        if (!isGit) {
          throw new Error('Not a Git repository');
        }

        await execAsync(`git restore --staged "${filePath}"`, {
          cwd: folderPath,
        });

        console.log('✅ File unstaged successfully:', filePath);
        return { success: true, path: filePath };
      } catch (error) {
        console.error('❌ Error unstaging file:', filePath, error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'Unknown error unstaging file';

        throw new Error(`Failed to unstage file: ${errorMessage}`);
      }
    },
  );

  ipcMain.handle(
    'git-commit',
    async (event, folderPath: string, message: string) => {
      try {
        console.log('💾 Creating Git commit with message:', message);

        if (!folderPath || !message) {
          throw new Error('Invalid folder path or commit message provided');
        }

        const isGit = await isGitRepository(folderPath);
        if (!isGit) {
          throw new Error('Not a Git repository');
        }

        await execAsync(`git commit -m "${message}"`, { cwd: folderPath });

        console.log('✅ Commit created successfully');
        return { success: true, message };
      } catch (error) {
        console.error('❌ Error creating commit:', error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'Unknown error creating commit';

        throw new Error(`Failed to create commit: ${errorMessage}`);
      }
    },
  );

  ipcMain.handle('git-push', async (event, folderPath: string) => {
    try {
      console.log('⬆️ Pushing to remote repository');

      if (!folderPath) {
        throw new Error('Invalid folder path provided');
      }

      const isGit = await isGitRepository(folderPath);
      if (!isGit) {
        throw new Error('Not a Git repository');
      }

      await execAsync('git push', { cwd: folderPath });

      console.log('✅ Successfully pushed to remote');
      return { success: true };
    } catch (error) {
      console.error('❌ Error pushing to remote:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error pushing to remote';

      throw new Error(`Failed to push to remote: ${errorMessage}`);
    }
  });

  ipcMain.handle('git-pull', async (event, folderPath: string) => {
    try {
      console.log('⬇️ Pulling from remote repository');

      if (!folderPath) {
        throw new Error('Invalid folder path provided');
      }

      const isGit = await isGitRepository(folderPath);
      if (!isGit) {
        throw new Error('Not a Git repository');
      }

      await execAsync('git pull', { cwd: folderPath });

      console.log('✅ Successfully pulled from remote');
      return { success: true };
    } catch (error) {
      console.error('❌ Error pulling from remote:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error pulling from remote';

      throw new Error(`Failed to pull from remote: ${errorMessage}`);
    }
  });
};
