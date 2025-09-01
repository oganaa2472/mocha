const express = require('express');
const todosRouter = require('./src/routes/todos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/todos', todosRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Todo List API is running!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Todo List API server running on port ${PORT}`);
  });
}

module.exports = app;