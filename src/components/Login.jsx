import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ref, get, set } from "firebase/database"; // Import Firebase Realtime Database methods
import { database } from "../firebaseConfig"; // Import Firebase database instance
import { Context } from "../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Track if the user is registering

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  // Handle Login by fetching credentials from Firebase Realtime Database
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userRef = ref(database, `users/${email.replace(".", "_")}`); // Replace '.' in email to avoid Firebase path errors
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          toast.success("Login Successful!");
          setIsAuthenticated(true);
          navigateTo("/");
        } else {
          toast.error("Invalid password. Please try again.");
        }
      } else {
        toast.error("User does not exist.");
      }
    } catch (error) {
      toast.error("Failed to login. Please try again.");
    }
  };

  // Handle Registration and store user credentials in Firebase Realtime Database
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const userRef = ref(database, `users/${email.replace(".", "_")}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        toast.error("User already exists. Please login.");
      } else {
        await set(userRef, {
          email: email,
          password: password,
        });
        toast.success("Registration Successful!");
        setIsAuthenticated(true);
        navigateTo("/");
      }
    } catch (error) {
      toast.error("Failed to register. Please try again.");
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="container form-component">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="form-title">WELCOME TO ZEECARE</h1>
        <p>Only Admins Are Allowed To Access These Resources!</p>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isRegistering && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">{isRegistering ? "Register" : "Login"}</button>
            <button
              type="button"
              onClick={() => setIsRegistering((prev) => !prev)}
              style={{ marginLeft: "10px" }}
            >
              {isRegistering ? "Already have an account? Login" : "Need to Register?"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
