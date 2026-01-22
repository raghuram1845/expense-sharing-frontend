import { useEffect, useState } from "react";
import Layout from "../componenets/Layout";
import { api } from "../api/api";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const btnStyle = {
    padding: "12px 18px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#111",
    color: "white",
    fontWeight: "bold",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    fontSize: "18px",
  };

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
    try {
      await api.post("/users", { name, email });
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      alert("Failed to create user");
    }
  };

  return (
    <Layout>
      <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "25px" }}>
        Users
      </h2>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <input
          style={inputStyle}
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button style={btnStyle} onClick={addUser}>
          Add User
        </button>
      </div>

      {users.length === 0 ? (
        <p style={{ textAlign: "center" }}>No users found</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{u.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{u.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
