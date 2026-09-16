import { useState } from "react";
import { Wallet, LogOut, Menu, X } from "lucide-react";

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = user?.email ? user.email[0].toUpperCase() : "?";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <Wallet size={20} strokeWidth={2} />
          <span>Expense Tracker</span>
        </div>

        <nav className="navbar-links navbar-links-desktop">
          <span className="navbar-link navbar-link-active">Dashboard</span>
        </nav>

        <div className="navbar-actions navbar-actions-desktop">
          <div className="navbar-user">
            <span className="navbar-avatar">{initial}</span>
            <span className="navbar-email">{user?.email}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onLogout}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        <button
          type="button"
          className="navbar-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="navbar-mobile-panel">
          <div className="navbar-user">
            <span className="navbar-avatar">{initial}</span>
            <span className="navbar-email">{user?.email}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onLogout}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
