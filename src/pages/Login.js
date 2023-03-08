import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        return;
      }

      const { token } = data;

      if (!token) {
        console.error("Invalid response format:", { token });
        setError("An unexpected error occurred");
        return;
      }

      setToken(token);

      localStorage.setItem("token", token);
      await fetchUser();
      alert("Welcome back " + `${username}` + "!");
      setIsLoggedIn(true);
      navigate("/Products");

      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div className="loginCont">
      <div className="loginCard">
        <h2>SIGN IN</h2>
        <form onSubmit={handleLogin}>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button type="submit">LOGIN</button>
          <div id="link">
            <Link to="/Register">REGISTER NEW ACCOUNT</Link>
          </div>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
