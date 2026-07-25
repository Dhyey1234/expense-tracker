import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    try {
      const response = await api.post("/signup", {
        email,
        password,
      });

      console.log(response.data);

      setMessage("Account created successfully");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);

      setMessage(error.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSignup}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button type="submit">Signup</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Signup;
