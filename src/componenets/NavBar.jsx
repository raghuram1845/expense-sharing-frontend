import { NavLink } from "react-router-dom";

export default function NavBar() {
  const linkStyle = ({ isActive }) => ({
    padding: "14px 18px",
    textDecoration: "none",
    fontWeight: "bold",
    color: isActive ? "#00c853" : "white",
  });

  return (
    <div
      style={{
        background: "#111",
        padding: "10px 0",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        fontSize: "18px",
      }}
    >
      <NavLink to="/users" style={linkStyle}>
        Users
      </NavLink>
      <NavLink to="/groups" style={linkStyle}>
        Groups
      </NavLink>
      <NavLink to="/expenses" style={linkStyle}>
        Expenses
      </NavLink>
      <NavLink to="/balances" style={linkStyle}>
        Balances
      </NavLink>
    </div>
  );
}
