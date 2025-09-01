const { v4: uuidv4 } = require('uuid');
const FileUtils = require('../utils/fileUtils');

class Todo {
  constructor(text, completed = false) {
    this.id = uuidv4();
    this.text = text;
    this.completed = completed;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Get all todos
   * @returns {Promise<Array>} Array of todos
   */
  static async findAll() {
    return await FileUtils.readTodos();
  }

  /**
   * Find todo by ID
   * @param {string} id - Todo ID
   * @returns {Promise<Object|null>} Todo object or null
   */
  static async findById(id) {
    const todos = await FileUtils.readTodos();
    return todos.find(todo => todo.id === id) || null;
  }

  /**
   * Create a new todo
   * @param {string} text - Todo text
   * @returns {Promise<Object>} Created todo
   */
  static async create(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Todo text is required and must be a non-empty string');
    }

    const newTodo = new Todo(text.trim());
    const todos = await FileUtils.readTodos();
    todos.push(newTodo);
    await FileUtils.writeTodos(todos);
    return newTodo;
  }

  /**
   * Update a todo
   * @param {string} id - Todo ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated todo or null
   */
  static async update(id, updates) {
    const todos = await FileUtils.readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return null;
    }

    const todo = todos[todoIndex];
    
    // Update allowed fields
    if (updates.text !== undefined) {
      if (!updates.text || typeof updates.text !== 'string' || updates.text.trim().length === 0) {
        throw new Error('Todo text must be a non-empty string');
      }
      todo.text = updates.text.trim();
    }
    
    if (updates.completed !== undefined) {
      if (typeof updates.completed !== 'boolean') {
        throw new Error('Completed field must be a boolean');
      }
      todo.completed = updates.completed;
    }

    todo.updatedAt = new Date().toISOString();
    todos[todoIndex] = todo;
    await FileUtils.writeTodos(todos);
    return todo;
  }

  /**
   * Delete a todo
   * @param {string} id - Todo ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(id) {
    const todos = await FileUtils.readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return false;
    }

    todos.splice(todoIndex, 1);
    await FileUtils.writeTodos(todos);
    return true;
  }

  /**
   * Delete all todos
   * @returns {Promise<void>}
   */
  static async deleteAll() {
    await FileUtils.writeTodos([]);
  }
}

module.exports = Todo;
