const { expect } = require('chai');
const fs = require('fs').promises;
const path = require('path');
const FileUtils = require('../../src/utils/fileUtils');

describe('FileUtils', () => {
  const originalTodosPath = FileUtils.TODOS_FILE_PATH;
  
  beforeEach(async () => {
    // Ensure data directory exists
    const dataDir = path.dirname(originalTodosPath);
    try {
      await fs.access(dataDir);
    } catch (error) {
      await fs.mkdir(dataDir, { recursive: true });
    }
    
    // Backup original file if it exists
    try {
      await fs.access(originalTodosPath);
      await fs.copyFile(originalTodosPath, originalTodosPath + '.backup');
    } catch (error) {
      // File doesn't exist, that's fine
    }
  });

  afterEach(async () => {
    // Restore original file
    try {
      await fs.unlink(originalTodosPath);
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    try {
      await fs.copyFile(originalTodosPath + '.backup', originalTodosPath);
      await fs.unlink(originalTodosPath + '.backup');
    } catch (error) {
      // Backup doesn't exist, that's fine
    }
  });

  describe('readTodos', () => {
    it('should return empty array when file does not exist', async () => {
      const todos = await FileUtils.readTodos();
      expect(todos).to.be.an('array');
      expect(todos).to.have.length(0);
    });

    it('should return parsed todos when file exists', async () => {
      const testTodos = [
        { id: '1', text: 'Test todo', completed: false },
        { id: '2', text: 'Another todo', completed: true }
      ];
      
      await fs.writeFile(originalTodosPath, JSON.stringify(testTodos));
      const todos = await FileUtils.readTodos();
      
      expect(todos).to.deep.equal(testTodos);
    });

    it('should throw error for invalid JSON', async () => {
      await fs.writeFile(originalTodosPath, 'invalid json');
      
      try {
        await FileUtils.readTodos();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });
  });

  describe('writeTodos', () => {
    it('should write todos to file', async () => {
      const testTodos = [
        { id: '1', text: 'Test todo', completed: false }
      ];
      
      await FileUtils.writeTodos(testTodos);
      
      const fileContent = await fs.readFile(originalTodosPath, 'utf8');
      const writtenTodos = JSON.parse(fileContent);
      
      expect(writtenTodos).to.deep.equal(testTodos);
    });

    it('should throw error when write fails', async () => {
      // Mock fs.writeFile to throw error
      const originalWriteFile = fs.writeFile;
      fs.writeFile = () => Promise.reject(new Error('Write failed'));
      
      try {
        await FileUtils.writeTodos([]);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Failed to write todos');
      } finally {
        fs.writeFile = originalWriteFile;
      }
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', async () => {
      await fs.writeFile(originalTodosPath, '[]');
      const exists = await FileUtils.fileExists();
      expect(exists).to.be.true;
    });

    it('should return false when file does not exist', async () => {
      try {
        await fs.unlink(originalTodosPath);
      } catch (error) {
        // File doesn't exist, that's fine
      }
      
      const exists = await FileUtils.fileExists();
      expect(exists).to.be.false;
    });
  });
});
