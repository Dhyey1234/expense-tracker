import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { authApi } from "../api/axios";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await authApi.post("/signup", {
        email,
        password,
      });

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      setMessage(
        error.response?.data?.error || "Signup failed"
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
          <h1>Create your account</h1>
          <p>Start tracking your spending in minutes.</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <Field label="Email" id="signup-email">
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label="Password" id="signup-password">
            <input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" size="md" disabled={submitting}>
            {submitting ? "Creating account…" : "Signup"}
          </Button>
        </form>

        {message && (
          <div
            className={`banner ${
              message === "Account created successfully!"
                ? "banner-success"
                : "banner-error"
            }`}
          >
            {message}
          </div>
        )}

        <p className="auth-switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
