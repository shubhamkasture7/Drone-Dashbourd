// AddNewAdmin.jsx
import React, { useState } from "react";
import { ref, set } from "firebase/database"; // Import Realtime Database methods
import { database } from "../FirebaseConfig"; // Correctly import the initialized database


const AddNewAdmin = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const adminRef = ref(database, "admins/" + nic); // Create a reference for this admin
      await set(adminRef, {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
      });

      alert("Admin added successfully!");

      // Reset form fields after submission
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");
    } catch (error) {
      alert("Failed to add admin: " + error.message);
    }
  };

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <h1 className="form-title">ADD NEW ADMIN</h1>
        <form onSubmit={handleAddNewAdmin}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="number"
            placeholder="NIC"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">ADD NEW ADMIN</button>
        </form>
      </section>
    </section>
  );
};

export default AddNewAdmin;
