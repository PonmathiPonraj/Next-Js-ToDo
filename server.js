const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ponmathittl:fFI6LTEYs2VQEluk@todolist.pnhjdjq.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/api/todos', async (req, res) => {
    const { task } = req.body;
    const todo = new Todo({ task, completed: false });
    await todo.save();
    res.json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findByIdAndUpdate(id, { $set: { completed: !req.body.completed } }, { new: true });
    res.json(todo);
});

const deleteTodo = async (id) => {
    // Delete todo from the server
    await axios.delete(`/api/todos/${id}`);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
};
  

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
