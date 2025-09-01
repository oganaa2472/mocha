const { expect } = require('chai');
const Todo = require('../../src/models/todo');
const FileUtils = require('../../src/utils/fileUtils');

describe('Todo Model', () => {
  beforeEach(async () => {
    // Clear todos before each test
    await Todo.deleteAll();
  });

  describe('constructor', () => {
    it('should create a todo with required properties', () => {
      const todo = new Todo('Test todo');
      
      expect(todo).to.have.property('id');
      expect(todo).to.have.property('text', 'Test todo');
      expect(todo).to.have.property('completed', false);
      expect(todo).to.have.property('createdAt');
      expect(todo).to.have.property('updatedAt');
      expect(todo.id).to.be.a('string');
      expect(todo.createdAt).to.be.a('string');
      expect(todo.updatedAt).to.be.a('string');
    });

    it('should create a completed todo when specified', () => {
      const todo = new Todo('Test todo', true);
      expect(todo.completed).to.be.true;
    });
  });

  describe('findAll', () => {
    it('should return empty array when no todos exist', async () => {
      const todos = await Todo.findAll();
      expect(todos).to.be.an('array');
      expect(todos).to.have.length(0);
    });

    it('should return all todos', async () => {
      const todo1 = await Todo.create('First todo');
      const todo2 = await Todo.create('Second todo');
      
      const todos = await Todo.findAll();
      expect(todos).to.have.length(2);
      expect(todos).to.deep.include(todo1);
      expect(todos).to.deep.include(todo2);
    });
  });

  describe('findById', () => {
    it('should return null for non-existent todo', async () => {
      const todo = await Todo.findById('non-existent-id');
      expect(todo).to.be.null;
    });

    it('should return todo by id', async () => {
      const createdTodo = await Todo.create('Test todo');
      const foundTodo = await Todo.findById(createdTodo.id);
      
      expect(foundTodo).to.deep.equal(createdTodo);
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const todo = await Todo.create('New todo');
      
      expect(todo).to.have.property('id');
      expect(todo).to.have.property('text', 'New todo');
      expect(todo).to.have.property('completed', false);
      expect(todo).to.have.property('createdAt');
      expect(todo).to.have.property('updatedAt');
    });

    it('should trim whitespace from text', async () => {
      const todo = await Todo.create('  Trimmed todo  ');
      expect(todo.text).to.equal('Trimmed todo');
    });

    it('should throw error for empty text', async () => {
      try {
        await Todo.create('');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('required');
      }
    });

    it('should throw error for whitespace-only text', async () => {
      try {
        await Todo.create('   ');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('required');
      }
    });

    it('should throw error for non-string text', async () => {
      try {
        await Todo.create(123);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('required');
      }
    });
  });

  describe('update', () => {
    it('should update todo text', async () => {
      const todo = await Todo.create('Original text');
      
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const updatedTodo = await Todo.update(todo.id, { text: 'Updated text' });
      
      expect(updatedTodo.text).to.equal('Updated text');
      expect(updatedTodo.completed).to.equal(false);
      expect(new Date(updatedTodo.updatedAt).getTime()).to.be.greaterThan(new Date(todo.updatedAt).getTime());
    });

    it('should update todo completion status', async () => {
      const todo = await Todo.create('Test todo');
      const updatedTodo = await Todo.update(todo.id, { completed: true });
      
      expect(updatedTodo.completed).to.be.true;
      expect(updatedTodo.text).to.equal('Test todo');
    });

    it('should update both text and completion status', async () => {
      const todo = await Todo.create('Original text');
      const updatedTodo = await Todo.update(todo.id, { 
        text: 'Updated text', 
        completed: true 
      });
      
      expect(updatedTodo.text).to.equal('Updated text');
      expect(updatedTodo.completed).to.be.true;
    });

    it('should return null for non-existent todo', async () => {
      const result = await Todo.update('non-existent-id', { text: 'New text' });
      expect(result).to.be.null;
    });

    it('should throw error for invalid text', async () => {
      const todo = await Todo.create('Test todo');
      
      try {
        await Todo.update(todo.id, { text: '' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('non-empty');
      }
    });

    it('should throw error for invalid completed value', async () => {
      const todo = await Todo.create('Test todo');
      
      try {
        await Todo.update(todo.id, { completed: 'not boolean' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('boolean');
      }
    });
  });

  describe('delete', () => {
    it('should delete existing todo', async () => {
      const todo = await Todo.create('Test todo');
      const deleted = await Todo.delete(todo.id);
      
      expect(deleted).to.be.true;
      
      const foundTodo = await Todo.findById(todo.id);
      expect(foundTodo).to.be.null;
    });

    it('should return false for non-existent todo', async () => {
      const deleted = await Todo.delete('non-existent-id');
      expect(deleted).to.be.false;
    });
  });

  describe('deleteAll', () => {
    it('should delete all todos', async () => {
      await Todo.create('Todo 1');
      await Todo.create('Todo 2');
      
      await Todo.deleteAll();
      
      const todos = await Todo.findAll();
      expect(todos).to.have.length(0);
    });
  });
});
