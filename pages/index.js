import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        // Fetch todos from the server
        axios.get('/api/todos').then((response) => {
            setTodos(response.data);
        });
    }, []);

    const addTodo = async () => {
        if (task.trim() !== '') {
            // Add todo to the server
            const response = await axios.post('/api/todos', { task });
            setTodos([...todos, response.data]);
            setTask('');
        }
    };

    const toggleTodo = async (id) => {
        const response = await axios.put(`/api/todos/${id}`);
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo._id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };  

    const deleteTodo = async (id) => {
        // Delete todo from the server
        await axios.delete(`/api/todos/${id}`);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    };
  
    return (
        <div>
            <h1>Todo List</h1>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <button onClick={addTodo}>Add Todo</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo._id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo._id)}
                        />
                        <span>{todo.task}</span>
                        <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
