const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const Todo = require('../../src/models/todo');

describe('Todo API Integration Tests', () => {
  beforeEach(async () => {
    // Clear todos before each test
    await Todo.deleteAll();
  });

  describe('GET /todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(0);
    });

    it('should return all todos', async () => {
      const todo1 = await Todo.create('First todo');
      const todo2 = await Todo.create('Second todo');

      const response = await request(app)
        .get('/todos')
        .expect(200);

      expect(response.body).to.have.length(2);
      expect(response.body).to.deep.include(todo1);
      expect(response.body).to.deep.include(todo2);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .get('/todos/non-existent-id')
        .expect(404)
        .expect({ error: 'Todo not found' });
    });

    it('should return specific todo', async () => {
      const todo = await Todo.create('Test todo');

      const response = await request(app)
        .get(`/todos/${todo.id}`)
        .expect(200);

      expect(response.body).to.deep.equal(todo);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const todoData = { text: 'New todo' };

      const response = await request(app)
        .post('/todos')
        .send(todoData)
        .expect(201);

      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('text', 'New todo');
      expect(response.body).to.have.property('completed', false);
      expect(response.body).to.have.property('createdAt');
      expect(response.body).to.have.property('updatedAt');

      // Verify it was saved
      const todos = await Todo.findAll();
      expect(todos).to.have.length(1);
      expect(todos[0]).to.deep.equal(response.body);
    });

    it('should return 400 for empty text', async () => {
      await request(app)
        .post('/todos')
        .send({ text: '' })
        .expect(400)
        .expect({ error: 'Todo text is required and must be a non-empty string' });
    });

    it('should return 400 for missing text', async () => {
      await request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .expect({ error: 'Todo text is required and must be a non-empty string' });
    });

    it('should trim whitespace from text', async () => {
      const response = await request(app)
        .post('/todos')
        .send({ text: '  Trimmed todo  ' })
        .expect(201);

      expect(response.body.text).to.equal('Trimmed todo');
    });
  });

  describe('PUT /todos/:id', () => {
    let todo;

    beforeEach(async () => {
      todo = await Todo.create('Original todo');
    });

    it('should update todo text', async () => {
      const response = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ text: 'Updated todo' })
        .expect(200);

      expect(response.body.text).to.equal('Updated todo');
      expect(response.body.completed).to.equal(false);
      expect(response.body.updatedAt).to.not.equal(todo.updatedAt);
    });

    it('should update todo completion status', async () => {
      const response = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body.completed).to.be.true;
      expect(response.body.text).to.equal('Original todo');
    });

    it('should update both text and completion status', async () => {
      const response = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ text: 'Updated text', completed: true })
        .expect(200);

      expect(response.body.text).to.equal('Updated text');
      expect(response.body.completed).to.be.true;
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .put('/todos/non-existent-id')
        .send({ text: 'New text' })
        .expect(404)
        .expect({ error: 'Todo not found' });
    });

    it('should return 400 for invalid text', async () => {
      await request(app)
        .put(`/todos/${todo.id}`)
        .send({ text: '' })
        .expect(400)
        .expect({ error: 'Todo text must be a non-empty string' });
    });

    it('should return 400 for invalid completed value', async () => {
      await request(app)
        .put(`/todos/${todo.id}`)
        .send({ completed: 'not boolean' })
        .expect(400)
        .expect({ error: 'Completed field must be a boolean' });
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete existing todo', async () => {
      const todo = await Todo.create('Test todo');

      await request(app)
        .delete(`/todos/${todo.id}`)
        .expect(204);

      // Verify it was deleted
      const todos = await Todo.findAll();
      expect(todos).to.have.length(0);
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .delete('/todos/non-existent-id')
        .expect(404)
        .expect({ error: 'Todo not found' });
    });
  });

  describe('Health Check', () => {
    it('should return health check message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).to.deep.equal({ message: 'Todo List API is running!' });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/unknown-route')
        .expect(404)
        .expect({ error: 'Route not found' });
    });
  });
});
