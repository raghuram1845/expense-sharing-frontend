import { useEffect, useState } from "react";
import Layout from "../componenets/Layout";
import { api } from "../api/api";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

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

  const fetchAll = async () => {
    const g = await api.get("/groups");
    const u = await api.get("/users");
    setGroups(g.data);
    setUsers(u.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const createGroup = async () => {
    await api.post(`/groups?name=${groupName}`);
    setGroupName("");
    fetchAll();
  };

  const addUserToGroup = async () => {
    if (!selectedGroupId || !selectedUserId) return;
    await api.post(`/groups/${selectedGroupId}/addUser/${selectedUserId}`);
    fetchAll();
  };

  return (
    <Layout>
      <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "25px" }}>
        Groups
      </h2>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <input
          style={inputStyle}
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button style={btnStyle} onClick={createGroup}>
          Create Group
        </button>
      </div>

      <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
        <select
          style={inputStyle}
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
        >
          <option value="">Select Group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} (ID: {g.id})
            </option>
          ))}
        </select>

        <select
          style={inputStyle}
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} (ID: {u.id})
            </option>
          ))}
        </select>

        <button style={btnStyle} onClick={addUserToGroup}>
          Add User
        </button>
      </div>

      {groups.length === 0 ? (
        <p style={{ textAlign: "center" }}>No groups found</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>Members</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{g.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>{g.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {g.members?.map((m) => m.name).join(", ") || "No Members"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
