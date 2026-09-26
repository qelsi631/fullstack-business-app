import { useState } from "react";
import { useNavigate } from "react-router-dom";

const demoCredentials = {
  email: "admin@business.com",
  password: "admin123",
};

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: demoCredentials.email,
    password: demoCredentials.password,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const enteredEmail = formData.email.trim().toLowerCase();
    const enteredPassword = formData.password;

    if (!enteredEmail || !enteredPassword) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5050/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }

      onLogin(data.user, data.token);
      navigate("/dashboard", { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">BusinessApp</div>
        <h1>Welcome back</h1>
        <p className="login-subtitle">Sign in to manage your business dashboard.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@business.com"
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="demo-box">
          <span>Demo credentials</span>
          <strong>admin@business.com</strong>
          <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}

export default Login;
