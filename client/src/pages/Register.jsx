import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
      const data = await registerUser(formData);

      login(data.user, data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration Failed"
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
          Register
        </h1>

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-3 rounded mb-4"
          value={formData.name}
          onChange={handleChange}
        />

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
          className="bg-green-600 text-white w-full p-3 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="mt-4 text-center">
          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 ml-2"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Register;