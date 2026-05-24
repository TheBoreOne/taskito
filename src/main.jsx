import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const STORAGE_KEY = 'taskito-docker-tasks';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          { id: crypto.randomUUID(), text: 'Crear mi primera tarea', done: false },
          { id: crypto.randomUUID(), text: 'Levantar la app con Docker', done: true }
        ];
  });
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') return tasks.filter((task) => !task.done);
    if (filter === 'done') return tasks.filter((task) => task.done);
    return tasks;
  }, [tasks, filter]);

  const pendingCount = tasks.filter((task) => !task.done).length;

  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setTasks([{ id: crypto.randomUUID(), text, done: false }, ...tasks]);
    setNewTask('');
  }

  function toggleTask(id) {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks(tasks.filter((task) => !task.done));
  }

  return (
    <main className="app-shell">
      <section className="card">
        <header className="header">
          <div>
            <p className="eyebrow">React + Docker</p>
            <h1>Taskito Docker</h1>
            <p className="subtitle">Una ToDo app sencilla, rápida y lista para desplegar.</p>
          </div>
          <span className="badge">{pendingCount} pendientes</span>
        </header>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Ej: Revisar logs del contenedor"
            aria-label="Nueva tarea"
          />
          <button type="submit">Agregar</button>
        </form>

        <div className="filters" aria-label="Filtros de tareas">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todas</button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pendientes</button>
          <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>Completadas</button>
        </div>

        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <li className="empty">No hay tareas para este filtro.</li>
          ) : (
            filteredTasks.map((task) => (
              <li key={task.id} className={task.done ? 'task done' : 'task'}>
                <label>
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                  <span>{task.text}</span>
                </label>
                <button className="delete" onClick={() => deleteTask(task.id)} aria-label={`Eliminar ${task.text}`}>
                  Eliminar
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="footer">
          <button onClick={clearCompleted}>Limpiar completadas</button>
          <small>Las tareas se guardan en localStorage.</small>
        </footer>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
