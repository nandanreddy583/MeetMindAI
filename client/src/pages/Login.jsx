import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const data = await loginUser(formData);

      login(data.user, data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 ml-2"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Login;