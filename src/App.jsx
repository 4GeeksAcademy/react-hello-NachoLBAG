// src/App.jsx
import React, { useState, useEffect } from "react";
import "./styles/index.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const username = "nacho_lb";

  // Crear usuario y cargar tareas al iniciar
  useEffect(() => {
    const initializeUser = async () => {
      try {
        await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
          method: "POST"
        });
      } catch (err) {
        console.warn("Usuario ya existente o error al crearlo:", err);
      } finally {
        fetchTasks();
      }
    };

    initializeUser();
  }, []);

  // Obtener tareas del usuario
  const fetchTasks = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${username}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error("Respuesta inesperada:", data);
        setTodos([]);
      }
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  };

  // Añadir nueva tarea
  const addTask = async (e) => {
    if (e.key === "Enter" && taskInput.trim() !== "") {
      const newTask = { label: taskInput.trim(), done: false };

      try {
        await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
          method: "POST",
          body: JSON.stringify(newTask),
          headers: { "Content-Type": "application/json" }
        });
        setTaskInput("");
        fetchTasks();
      } catch (err) {
        console.error("Error al agregar tarea:", err);
      }
    }
  };

  // Eliminar tarea por ID
  const deleteTask = async (id) => {
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE"
      });
      fetchTasks();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  // Eliminar todas las tareas
  const clearAllTasks = async () => {
    try {
      await Promise.all(
        todos.map((task) =>
          fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
            method: "DELETE"
          })
        )
      );
      fetchTasks();
    } catch (err) {
      console.error("Error al eliminar todas las tareas:", err);
    }
  };

  return (
    <div className="todoapp">
      <h1>Lista de Tareas</h1>
      <input
        className="new-todo"
        placeholder="¿Qué necesitas hacer?"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        onKeyDown={addTask}
      />
      <ul className="todo-list">
        {Array.isArray(todos) && todos.length > 0 ? (
          todos.map((task) => (
            <li key={task.id} className="task-item">
              <div className="view">
                <label>{task.label}</label>
                <button className="destroy" onClick={() => deleteTask(task.id)}>
                  🗑️
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="no-tasks">No hay tareas disponibles.</p>
        )}
      </ul>
      <footer className="footer">
        <span className="todo-count">
          <strong>{todos.length}</strong> tarea{todos.length !== 1 ? "s" : ""} pendiente{todos.length !== 1 ? "s" : ""}
        </span>
        <button className="clear-button" onClick={clearAllTasks}>
          Eliminar todas
        </button>
      </footer>
    </div>
  );
};

export default App;
