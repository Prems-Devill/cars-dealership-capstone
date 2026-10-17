import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/djangoapp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userName: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed.");
      setMessage("Registration successful. You can now log in.");
      setFormData({ username: "", firstName: "", lastName: "", email: "", password: "" });
    } catch (error) {
      setMessage(error.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="register-page">
      <h1>Sign-up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} required autoComplete="username" />
        </div>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} required autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required autoComplete="family-name" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
        </div>
        <button type="submit" disabled={busy}>{busy ? "Registering..." : "Register"}</button>
        {message && <p role="status">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
