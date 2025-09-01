const fs = require('fs').promises;
const path = require('path');

const TODOS_FILE_PATH = path.join(__dirname, '../../data/todos.json');

class FileUtils {
  /**
   * Read todos from JSON file
   * @returns {Promise<Array>} Array of todos
   */
  static async readTodos() {
    try {
      const data = await fs.readFile(TODOS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  /**
   * Write todos to JSON file
   * @param {Array} todos - Array of todos to write
   * @returns {Promise<void>}
   */
  static async writeTodos(todos) {
    try {
      await fs.writeFile(TODOS_FILE_PATH, JSON.stringify(todos, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Failed to write todos: ${error.message}`);
    }
  }

  /**
   * Check if todos file exists
   * @returns {Promise<boolean>}
   */
  static async fileExists() {
    try {
      await fs.access(TODOS_FILE_PATH);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = FileUtils;
module.exports.TODOS_FILE_PATH = TODOS_FILE_PATH;
