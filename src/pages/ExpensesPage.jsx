import { useEffect, useMemo, useState } from "react";
import Layout from "../componenets/Layout";
import { api } from "../api/api";

export default function ExpensesPage() {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");

  
  const [groupUsers, setGroupUsers] = useState([]);

  const [paidByUserId, setPaidByUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  
  const [splitType, setSplitType] = useState("EQUAL"); 

  
  const [exactAmounts, setExactAmounts] = useState({});
  const [percentages, setPercentages] = useState({});

  const [loading, setLoading] = useState(false);

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

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "18px",
    background: "#fff",
  };

  
  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups");
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load groups ❌");
    }
  };

  
  const fetchGroupMembers = async (gid) => {
    if (!gid) {
      setGroupUsers([]);
      return;
    }

    try {
      
      const res = await api.get(`/groups/${gid}`);
      setGroupUsers(res.data?.members || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load group members ❌");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  
  useEffect(() => {
    fetchGroupMembers(groupId);

    setPaidByUserId("");
    setAmount("");
    setDescription("");
    setSplitType("EQUAL");
    setExactAmounts({});
    setPercentages({});
  }, [groupId]);

  
  useEffect(() => {
    setExactAmounts({});
    setPercentages({});
  }, [splitType]);

  const groupUserIds = useMemo(
    () => groupUsers.map((u) => u.id),
    [groupUsers]
  );

  const handleExactChange = (userId, value) => {
    setExactAmounts((prev) => ({
      ...prev,
      [String(userId)]: value,
    }));
  };

  const handlePercentChange = (userId, value) => {
    setPercentages((prev) => ({
      ...prev,
      [String(userId)]: value,
    }));
  };

  const validate = () => {
    if (!groupId) return alert("Select a group"), false;
    if (!paidByUserId) return alert("Select Paid By user"), false;

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return alert("Enter valid amount"), false;

    if (splitType === "EXACT") {
      let sum = 0;
      groupUserIds.forEach((id) => (sum += Number(exactAmounts[String(id)] || 0)));

      
      if (sum.toFixed(2) !== amt.toFixed(2)) {
        alert(`❌ EXACT split total must equal amount.\nAmount = ${amt}\nSplit sum = ${sum}`);
        return false;
      }
    }

    if (splitType === "PERCENTAGE") {
      let sum = 0;
      groupUserIds.forEach((id) => (sum += Number(percentages[String(id)] || 0)));

      if (sum !== 100) {
        alert(`❌ Percentages must total 100.\nCurrent total = ${sum}`);
        return false;
      }
    }

    return true;
  };

  const addExpense = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        description,
        amount: Number(amount),
        paidByUserId: Number(paidByUserId),
        groupId: Number(groupId),
        splitType,
      };

      
      if (splitType === "EQUAL") {
        payload.participantUserIds = groupUserIds;
      }

      
      if (splitType === "EXACT") {
        const obj = {};
        groupUserIds.forEach((id) => {
          obj[String(id)] = Number(exactAmounts[String(id)] || 0);
        });
        payload.exactAmounts = obj;
      }

      
      if (splitType === "PERCENTAGE") {
        const obj = {};
        groupUserIds.forEach((id) => {
          obj[String(id)] = Number(percentages[String(id)] || 0);
        });
        payload.percentages = obj;
      }

      console.log("✅ POST /expenses payload:", payload);

      
      await api.post("/expenses", payload);

      alert("Expense Added ✅");

      
      setPaidByUserId("");
      setAmount("");
      setDescription("");
      setSplitType("EQUAL");
      setExactAmounts({});
      setPercentages({});
    } catch (err) {
      console.log("❌ addExpense error:", err?.response?.data || err.message);
      alert("Failed to add expense ❌ (Check console for details)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "25px" }}>
        Expenses
      </h2>

      <div style={{ display: "grid", gap: "18px", maxWidth: "850px", margin: "auto" }}>
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 12 }}>Add Expense</h3>

          <div style={{ display: "grid", gap: "12px" }}>
            {/* Group */}
            <select style={inputStyle} value={groupId} onChange={(e) => setGroupId(e.target.value)}>
              <option value="">Select Group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} (ID: {g.id})
                </option>
              ))}
            </select>

            
            <select
              style={inputStyle}
              value={paidByUserId}
              onChange={(e) => setPaidByUserId(e.target.value)}
              disabled={!groupId}
            >
              <option value="">Paid By (Group Members Only)</option>
              {groupUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (ID: {u.id})
                </option>
              ))}
            </select>

            
            <select
              style={inputStyle}
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
              disabled={!groupId}
            >
              <option value="EQUAL">EQUAL</option>
              <option value="EXACT">EXACT</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
            </select>

            <input
              style={inputStyle}
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!groupId}
            />

            <input
              style={inputStyle}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!groupId}
            />

            
            {(splitType === "EXACT" || splitType === "PERCENTAGE") && (
              <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14 }}>
                <h4 style={{ marginBottom: 10 }}>
                  {splitType === "EXACT" ? "Enter Exact Amounts" : "Enter Percentages"}
                </h4>

                {groupUsers.length === 0 ? (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    No users in this group. Add users first.
                  </p>
                ) : (
                  groupUsers.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ width: "45%", fontWeight: "bold" }}>{u.name}</div>

                      <input
                        type="number"
                        placeholder={splitType === "EXACT" ? "₹ amount" : "%"}
                        value={
                          splitType === "EXACT"
                            ? exactAmounts[String(u.id)] || ""
                            : percentages[String(u.id)] || ""
                        }
                        onChange={(e) =>
                          splitType === "EXACT"
                            ? handleExactChange(u.id, e.target.value)
                            : handlePercentChange(u.id, e.target.value)
                        }
                        style={{ ...inputStyle, width: "55%" }}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            <button style={btnStyle} onClick={addExpense} disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
