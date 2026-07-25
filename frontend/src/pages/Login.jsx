import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>Login Page</h1>

      <p>
        Don't have an account?
        <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}
export default Login;
