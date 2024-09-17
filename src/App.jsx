import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";
import RingLoader from "react-spinners/RingLoader"; // Import FadeLoader
import { CgOverflow } from "react-icons/cg";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setAdmin } = useContext(Context);
  const [loading, setLoading] = useState(true);

  // Define color for FadeLoader
  const color = "#36d7b7"; // You can use any color code here

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setIsAuthenticated, setAdmin]);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <RingLoader  color={color} size={150} />
      </div>
    );
  }

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/addnew" element={isAuthenticated ? <AddNewDoctor /> : <Navigate to="/login" />} />
        <Route path="/admin/addnew" element={isAuthenticated ? <AddNewAdmin /> : <Navigate to="/login" />} />
        <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/doctors" element={isAuthenticated ? <Doctors /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

// Define CSS styles for centering the loader
const styles = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full viewport height
    overflow: "hidden",
  },
};

export default App;
