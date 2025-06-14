import fs from 'fs';
import path from 'path';
import { ipcMain } from 'electron';
import { getLanguageFromFileName } from '../../constants/languages';

export const registerFileHandlers = () => {
  ipcMain.handle('read-file', async (event, filePath: string) => {
    let result = null;

    try {
      console.log('Reading file:', filePath);

      if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path provided');
      }

      const stats = await fs.promises.stat(filePath).catch(statError => {
        throw new Error(`Cannot access file: ${statError.message}`);
      });

      if (!stats.isFile()) {
        throw new Error('Path is not a file');
      }

      const content = await fs.promises
        .readFile(filePath, 'utf8')
        .catch(readError => {
          throw new Error(`Cannot read file content: ${readError.message}`);
        });

      const fileName = path.basename(filePath);
      const language = getLanguageFromFileName(fileName);

      result = {
        path: filePath,
        name: fileName,
        content,
        language,
      };

      if (
        !result.path ||
        !result.name ||
        typeof result.content !== 'string' ||
        !result.language
      ) {
        throw new Error('Invalid file data structure');
      }

      console.log(
        'File read successfully:',
        fileName,
        `(${content.length} chars, ${language})`,
      );
      return result;
    } catch (error) {
      console.error('Error reading file:', filePath, error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error reading file';

      const finalError = new Error(`Failed to read file: ${errorMessage}`);

      console.error('Final error being thrown:', finalError.message);

      throw finalError;
    }
  });

  ipcMain.handle(
    'save-file',
    async (event, filePath: string, content: string) => {
      try {
        console.log('🔄 Starting save operation...');
        console.log('📁 File path:', filePath);
        console.log('📝 Content length:', content.length);
        console.log(
          '📝 Content preview (first 100 chars):',
          content.substring(0, 100),
        );

        if (!filePath || typeof filePath !== 'string') {
          throw new Error('Invalid file path provided');
        }

        if (typeof content !== 'string') {
          throw new Error('Invalid file content provided');
        }

        const backupPath = `${filePath}.backup`;
        try {
          if (fs.existsSync(filePath)) {
            await fs.promises.copyFile(filePath, backupPath);
            console.log('💾 Backup created:', backupPath);
          }
        } catch (backupError) {
          console.warn('Could not create backup:', backupError);
        }

        console.log('✍️ Writing file...');
        await fs.promises
          .writeFile(filePath, content, 'utf8')
          .catch(writeError => {
            throw new Error(`Cannot write file content: ${writeError.message}`);
          });

        console.log('🔍 Verifying write...');
        const writtenContent = await fs.promises.readFile(filePath, 'utf8');
        console.log('📖 Written content length:', writtenContent.length);

        if (writtenContent.length !== content.length) {
          throw new Error(
            `Write verification failed: expected ${content.length} chars, got ${writtenContent.length}`,
          );
        }

        try {
          if (fs.existsSync(backupPath)) {
            await fs.promises.unlink(backupPath);
            console.log('🗑️ Backup removed');
          }
        } catch (cleanupError) {
          console.warn('Could not remove backup file:', cleanupError);
        }

        console.log(
          '✅ File saved successfully:',
          filePath,
          `(${content.length} chars)`,
        );
        return { success: true, path: filePath };
      } catch (error) {
        console.error('❌ Error saving file:', filePath, error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'Unknown error saving file';

        throw new Error(`Failed to save file: ${errorMessage}`);
      }
    },
  );

  ipcMain.handle(
    'create-file',
    async (event, filePath: string, content: string = '') => {
      try {
        console.log('📝 Creating new file:', filePath);

        if (!filePath || typeof filePath !== 'string') {
          throw new Error('Invalid file path provided');
        }

        if (fs.existsSync(filePath)) {
          throw new Error('File already exists');
        }

        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
          await fs.promises.mkdir(dirPath, { recursive: true });
          console.log('📁 Created directory:', dirPath);
        }

        await fs.promises.writeFile(filePath, content, 'utf8');

        console.log('✅ File created successfully:', filePath);
        return { success: true, path: filePath };
      } catch (error) {
        console.error('❌ Error creating file:', filePath, error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'Unknown error creating file';

        throw new Error(`Failed to create file: ${errorMessage}`);
      }
    },
  );

  ipcMain.handle('delete-file', async (event, filePath: string) => {
    try {
      console.log('🗑️ Deleting file:', filePath);

      if (!filePath || typeof filePath !== 'string') {
        throw new Error('Invalid file path provided');
      }

      if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist');
      }

      const stats = await fs.promises.stat(filePath);
      if (!stats.isFile()) {
        throw new Error('Path is not a file');
      }

      await fs.promises.unlink(filePath);

      console.log('✅ File deleted successfully:', filePath);
      return { success: true, path: filePath };
    } catch (error) {
      console.error('❌ Error deleting file:', filePath, error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error deleting file';

      throw new Error(`Failed to delete file: ${errorMessage}`);
    }
  });

  ipcMain.handle(
    'rename-file',
    async (event, oldPath: string, newPath: string) => {
      try {
        console.log('✏️ Renaming file:', oldPath, '->', newPath);

        if (!oldPath || typeof oldPath !== 'string') {
          throw new Error('Invalid old file path provided');
        }
        if (!newPath || typeof newPath !== 'string') {
          throw new Error('Invalid new file path provided');
        }

        if (!fs.existsSync(oldPath)) {
          throw new Error('File does not exist');
        }

        if (fs.existsSync(newPath)) {
          throw new Error('A file or folder with that name already exists');
        }

        const stats = await fs.promises.stat(oldPath);
        if (!stats.isFile()) {
          throw new Error('Path is not a file');
        }

        await fs.promises.rename(oldPath, newPath);

        console.log('✅ File renamed successfully:', oldPath, '->', newPath);
        return { success: true, oldPath, newPath };
      } catch (error) {
        console.error('❌ Error renaming file:', oldPath, error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'Unknown error renaming file';

        throw new Error(`Failed to rename file: ${errorMessage}`);
      }
    },
  );
};
