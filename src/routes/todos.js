const express = require('express');
const Todo = require('../models/todo');

const router = express.Router();

// GET /todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET /todos/:id - Get a specific todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// POST /todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    const todo = await Todo.create(text);
    res.status(201).json(todo);
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('non-empty')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const { text, completed } = req.body;
    const updates = {};
    
    if (text !== undefined) updates.text = text;
    if (completed !== undefined) updates.completed = completed;
    
    const todo = await Todo.update(req.params.id, updates);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('non-empty') || error.message.includes('boolean')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
