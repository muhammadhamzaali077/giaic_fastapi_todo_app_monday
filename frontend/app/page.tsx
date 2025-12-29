"use client";
import { useEffect, useState } from "react";

type Todo = {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
};

export default function Home() {
  const API = "http://127.0.0.1:8000/todos";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState<Todo>({
    title: "",
    description: "",
    completed: false,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    const res = await fetch(API);
    setTodos(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    reset();
  }

  async function update() {
    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    reset();
  }

  async function remove(id: number) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
  }

  function reset() {
    setForm({ title: "", description: "", completed: false });
    setEditingId(null);
    load();
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "30px auto",
        fontFamily: "system-ui",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center" }}>📝 Todo App</h1>

      {/* Form Card */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 20,
          marginTop: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h3>{editingId ? "✏️ Edit Todo" : "➕ Add Todo"}</h3>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            style={{
              flex: 2,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(e) =>
                setForm({ ...form, completed: e.target.checked })
              }
            />
            Completed
          </label>

          {editingId ? (
            <>
              <button
                onClick={update}
                style={{
                  background: "#0070f3",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                💾 Save Changes
              </button>

              <button
                onClick={reset}
                style={{
                  background: "#999",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                ❌ Cancel
              </button>
            </>
          ) : (
            <button
              onClick={create}
              style={{
                background: "green",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ➕ Add Todo
            </button>
          )}
        </div>
      </div>

      {/* List Section */}
      <h2 style={{ marginTop: 30 }}>📋 Todos</h2>

      {todos.length === 0 && (
        <p style={{ color: "#666" }}>No todos yet. Add one above 👆</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((t) => (
          <li
            key={t.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <b style={{ fontSize: 16 }}>{t.title}</b>
              <div style={{ color: "#555" }}>{t.description}</div>
              <div
                style={{
                  marginTop: 5,
                  color: t.completed ? "green" : "orange",
                  fontWeight: 600,
                }}
              >
                {t.completed ? "✔ Completed" : "⏳ Pending"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setEditingId(t.id!);
                  setForm(t);
                }}
                style={{
                  background: "#0070f3",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                ✏ Edit
              </button>

              <button
                onClick={() => remove(t.id!)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
