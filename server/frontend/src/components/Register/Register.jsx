import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Registration request can be connected to the Django API here.
  };

  return (
    <div className="register-page">
      <h1>Sign-up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
