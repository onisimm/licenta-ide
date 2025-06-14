import { exec } from 'child_process';
import { promisify } from 'util';
import { GitFileStatus, GitBranchInfo } from '../types/git';

const execAsync = promisify(exec);

export const isGitRepository = async (folderPath: string): Promise<boolean> => {
  try {
    await execAsync('git rev-parse --git-dir', { cwd: folderPath });
    return true;
  } catch (error) {
    return false;
  }
};

export const parseGitStatus = (output: string): GitFileStatus[] => {
  const lines = output.split('\n').filter(line => line.trim());
  const files: GitFileStatus[] = [];

  console.log('🔍 Parsing Git status output:', { totalLines: lines.length });

  for (const line of lines) {
    if (line.startsWith('##')) {
      console.log('📋 Skipping branch line:', line);
      continue;
    }

    if (line.length < 3) {
      console.log('⏭️ Skipping short line:', line);
      continue;
    }

    const stagedChar = line[0];
    const unstagedChar = line[1];
    const filePath = line.substring(3);

    console.log('📄 Processing file line:', {
      line,
      stagedChar,
      unstagedChar,
      filePath,
    });

    if (stagedChar === ' ' && unstagedChar === ' ') {
      console.log('⏭️ Skipping line with no changes:', line);
      continue;
    }

    const getStatusFromChar = (char: string): GitFileStatus['status'] => {
      switch (char) {
        case 'A':
          return 'added';
        case 'M':
          return 'modified';
        case 'D':
          return 'deleted';
        case 'R':
          return 'renamed';
        case 'C':
          return 'renamed';
        case '?':
          return 'untracked';
        case '!':
          return 'untracked';
        default:
          return 'modified';
      }
    };

    if (stagedChar !== ' ' && stagedChar !== '?') {
      const stagedStatus = getStatusFromChar(stagedChar);
      const stagedFileStatus: GitFileStatus = {
        path: filePath,
        status: stagedStatus,
        staged: true,
      };
      files.push(stagedFileStatus);
      console.log('✅ Added staged file to status:', stagedFileStatus);
    }

    if (unstagedChar !== ' ') {
      const unstagedStatus = getStatusFromChar(unstagedChar);
      const unstagedFileStatus: GitFileStatus = {
        path: filePath,
        status: unstagedStatus,
        staged: false,
      };
      files.push(unstagedFileStatus);
      console.log('✅ Added unstaged file to status:', unstagedFileStatus);
    }
  }

  console.log(
    `📊 Git status parsing complete: ${files.length} file entries found`,
  );
  return files;
};

export const parseGitBranch = (
  output: string,
): { current: string; ahead: number; behind: number } => {
  const lines = output.split('\n');
  let current = 'main';
  let ahead = 0;
  let behind = 0;

  for (const line of lines) {
    if (line.startsWith('##')) {
      const branchInfo = line.substring(3);
      const match = branchInfo.match(/^(\S+)(?:\.\.\.(\S+))?\s*(?:\[(.+)\])?/);

      if (match) {
        current = match[1];
        const trackingInfo = match[3];

        if (trackingInfo) {
          const aheadMatch = trackingInfo.match(/ahead (\d+)/);
          const behindMatch = trackingInfo.match(/behind (\d+)/);

          if (aheadMatch) ahead = parseInt(aheadMatch[1], 10);
          if (behindMatch) behind = parseInt(behindMatch[1], 10);
        }
      }
      break;
    }
  }

  return { current, ahead, behind };
};
