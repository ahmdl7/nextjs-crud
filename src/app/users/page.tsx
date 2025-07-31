"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return alert("Mohon isi semua kolom.");

    const method = editId === null ? "POST" : "PATCH";
    const url = editId === null ? "/api/users" : `/api/users/${editId}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const error = await res.json();
      if (error.error?.includes("unique") || error.error?.includes("Email")) {
        alert("Email sudah digunakan, silakan coba yang lain.");
      } else {
        alert("Terjadi kesalahan saat menyimpan data.");
      }
      return;
    }

    // jika sukses
    setName("");
    setEmail("");
    setEditId(null);
    fetchUsers();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  }

  function handleEdit(user: User) {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>User CRUD</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {editId === null ? "Add User" : "Update User"}
        </button>
        {editId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setName("");
              setEmail("");
            }}
            style={{ ...styles.button, backgroundColor: "#888" }}
          >
            Cancel
          </button>
        )}
      </form>

      <ul style={styles.list}>
        {users.map((user) => (
          <li key={user.id} style={styles.listItem}>
            <span>
              <strong>{user.name}</strong> ({user.email})
            </span>
            <div>
              <button
                onClick={() => handleEdit(user)}
                style={styles.smallButton}
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                style={styles.smallButton}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "14px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "fit-content",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    marginBottom: "10px",
  },
  smallButton: {
    marginLeft: "8px",
    padding: "6px 10px",
    fontSize: "12px",
    cursor: "pointer",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
};
