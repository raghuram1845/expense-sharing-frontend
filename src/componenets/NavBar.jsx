import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Users", path: "/users" },
    { name: "Groups", path: "/groups" },
    { name: "Expenses", path: "/expenses" },
    { name: "Balances", path: "/balances" },
  ];

  return (
    <div style={styles.navWrapper}>
      <div style={styles.navbar}>
        {links.map((l) => (
          <Link
            key={l.path}
            to={l.path}
            style={{
              ...styles.link,
              ...(location.pathname === l.path ? styles.active : {}),
            }}
          >
            {l.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  navWrapper: {
    width: "100%",
    background: "#111",
    display: "flex",
    justifyContent: "center",
  },


  navbar: {
    display: "flex",
    gap: "25px",
    padding: "15px 10px",
    overflowX: "auto",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    scrollbarWidth: "none", 
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: "bold",
    padding: "6px 10px",
    borderRadius: "8px",
  },

  active: {
    color: "#00ff00",
    background: "rgba(255,255,255,0.1)",
  },
};