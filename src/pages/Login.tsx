import React, { useState, ChangeEvent, FormEvent } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginData {
  firstname: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    firstname: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        'https://video-uploader-api.vercel.app/api/accounts/login',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.token) {
        console.log("Login successful");
        // Store the token in localStorage or a secure storage method
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        navigate("/profile");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={loginData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
      <div className="create-account-container">
        <p>Don't have an account?</p>
        <button onClick={() => navigate("/register")}>Create Account</button>
      </div>
    </div>
  );
};

export default Login;
