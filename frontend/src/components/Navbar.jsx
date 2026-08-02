function Navbar({ user, onLogout }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        borderBottom: "1px solid #ddd",
        marginBottom: "30px"
      }}
    >
      <h2>Expense Tracker</h2>

      <div>
        <span style={{ marginRight: "20px" }}>
          {user.email}
        </span>

        <button onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;