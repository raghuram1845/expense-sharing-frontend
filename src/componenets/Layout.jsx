import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <NavBar />

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
