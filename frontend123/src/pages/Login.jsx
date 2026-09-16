import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { authApi } from "../api/axios";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await authApi.post("/login", {
        email,
        password,
      });

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save user info
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Login failed"
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">
            <Wallet size={18} strokeWidth={2} />
          </span>
          Expense Tracker
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <Field label="Email" id="login-email">
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label="Password" id="login-password">
            <input
              id="login-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" size="md" disabled={submitting}>
            {submitting ? "Signing in…" : "Login"}
          </Button>
        </form>

        {message && (
          <div
            className={`banner ${
              message === "Login successful!" ? "banner-success" : "banner-error"
            }`}
          >
            {message}
          </div>
        )}

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
