import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { database } from "../FirebaseConfig"; // Import Firebase database
import { ref, get } from "firebase/database"; // Firebase methods for fetching data

const UserInfo = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optimized fetch function to get admin data
  const fetchAdminData = useCallback(async (adminId) => {
    try {
      const adminRef = ref(database, `admins/${adminId}`); // Change path to `admins`
      const snapshot = await get(adminRef);
      if (snapshot.exists()) {
        const adminData = snapshot.val();
        setAdminInfo(adminData); // Set the whole admin object
      } else {
        toast.error("Admin data not found.");
      }
    } catch (error) {
      toast.error("Failed to load admin information.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Use useEffect to fetch admin information only once
  useEffect(() => {
    const adminId = localStorage.getItem("loggedInAdminId"); // Change key to match admin ID storage

    if (!adminId) {
      toast.error("No admin is logged in.");
      setLoading(false);
      return;
    }

    fetchAdminData(adminId);
  }, [fetchAdminData]);

  if (loading) {
    return <p>Loading admin information...</p>;
  }

  if (!adminInfo) {
    return <p>No admin information available.</p>;
  }

  return (
    <div className="admin-info">
      <h3>Logged in as:</h3>
      <p>Name: {adminInfo.name || "No Name Available"}</p>
      <p>Email: {adminInfo.email || "No Email Available"}</p>
      {/* Add other admin details as needed */}
    </div>
  );
};

export default UserInfo;
