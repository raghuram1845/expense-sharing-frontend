import { useEffect, useState } from "react";
import { api } from "../api/api";
import Layout from "../componenets/Layout";

export default function BalancesPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all groups
  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups");
      setGroups(res.data || []);
    } catch (err) {
      console.error("Error fetching groups:", err);
      alert("Failed to load groups");
    }
  };

  // ✅ Fetch balances + settlements for selected group
  const fetchBalancesAndSettlements = async (groupId) => {
    if (!groupId) return;

    setLoading(true);
    try {
      const balancesRes = await api.get(`/groups/${groupId}/balances`);
      const balancesObj = balancesRes.data || {};

      const balancesArray = Object.entries(balancesObj).map(
        ([user, balance]) => ({
          user,
          balance: Number(balance),
        })
      );

      setBalances(balancesArray);

      const settlementsRes = await api.get(`/groups/${groupId}/settlements`);
      setSettlements(settlementsRes.data || []);
    } catch (err) {
      console.error("Error fetching balances/settlements:", err);
      alert("Failed to load balances / settlements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchBalancesAndSettlements(selectedGroupId);
  }, [selectedGroupId]);

  return (
    <Layout>
      <div style={{ width: "100%" }}>
        <h1 style={{ fontSize: 30, fontWeight: "bold", marginBottom: 15 }}>
          Balances
        </h1>

        {/* ✅ Group dropdown */}
        <div style={{ marginTop: 15, marginBottom: 25 }}>
          <label style={{ marginRight: 10, fontWeight: "bold" }}>
            Select Group:
          </label>

          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            style={{
              padding: 10,
              width: 280,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 15,
            }}
          >
            <option value="">-- Select a group --</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} (ID: {g.id})
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p style={{ marginTop: 20, fontWeight: "bold" }}>Loading...</p>
        )}

        {/* ✅ Balances Table */}
        <h2 style={{ marginTop: 10, fontSize: 22, fontWeight: "bold" }}>
          Group Balances
        </h2>

        {balances.length === 0 && !loading ? (
          <p>No balances found</p>
        ) : (
          <table
            style={{
              marginTop: 12,
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 16,
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Balance</th>
              </tr>
            </thead>

            <tbody>
              {balances.map((b, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{b.user}</td>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "bold",
                      color:
                        b.balance > 0
                          ? "green"
                          : b.balance < 0
                          ? "red"
                          : "black",
                    }}
                  >
                    ₹{b.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ✅ Settlements */}
        <h2 style={{ marginTop: 35, fontSize: 22, fontWeight: "bold" }}>
          Settlements
        </h2>

        {settlements.length === 0 && !loading ? (
          <p>No settlements required ✅</p>
        ) : (
          <div style={{ marginTop: 12 }}>
            {settlements.map((s, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  padding: 15,
                  marginBottom: 12,
                  borderRadius: 10,
                  width: "100%",
                  maxWidth: "750px",
                  background: "#fafafa",
                }}
              >
                <b>{s.from}</b> pays <b>{s.to}</b> :{" "}
                <b>₹{Number(s.amount).toFixed(2)}</b>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

/* ✅ Styles */
const thStyle = {
  border: "1px solid #ddd",
  padding: 12,
  textAlign: "left",
  background: "#f3f3f3",
  fontSize: 16,
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: 12,
};
