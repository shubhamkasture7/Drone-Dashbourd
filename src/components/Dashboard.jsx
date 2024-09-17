import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { database } from "../FirebaseConfig";
import { ref, get, update } from "firebase/database";
import UserInfo from "./UserInfo";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch appointments from Firebase
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const appointmentsRef = ref(database, "appointments");
        const snapshot = await get(appointmentsRef);
        if (snapshot.exists()) {
          const appointmentsData = snapshot.val();
          setAppointments(Object.entries(appointmentsData).map(([id, data]) => ({ id, ...data })));
        } else {
          setAppointments([]);
        }
      } catch (error) {
        toast.error("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch user info (including email)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("loggedInUserId");
        if (!userId) {
          throw new Error("No user is logged in.");
        }
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          toast.error("User data not found.");
        }
      } catch (error) {
        toast.error("Failed to load user information.");
      }
    };

    fetchUser();
  }, []);

  // Update appointment status in Firebase
  const handleUpdateStatus = useCallback(
    async (appointmentId, status) => {
      try {
        const appointmentRef = ref(database, `appointments/${appointmentId}`);
        await update(appointmentRef, { status });

        // Update the specific appointment's status locally
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, status } : appointment
          )
        );

        toast.success("Status updated successfully.");
      } catch (error) {
        toast.error("Failed to update status.");
      }
    },
    [setAppointments]
  );

  // Memoized count for total appointments and registered doctors
  const totalAppointments = useMemo(() => appointments.length, [appointments]);
  const totalDoctors = useMemo(() => {
    const doctorSet = new Set(appointments.map((appt) => appt.doctor?.id));
    return doctorSet.size;
  }, [appointments]);

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/logotry.png" alt="Doctor" />
          <div className="content">
            <p>Hello, {user?.name || 'Admin'}</p>
            <p>Email: {user?.email || 'No email available'}</p>
            <p>
              The Krishak drone can operate in multiple modes, across landscapes
              and altitudes, and integrate with a range of payloads based on the
              application. It also has an advanced crop care protocol, active
              system health monitoring, and a detect and avoid feature.
            </p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{totalAppointments}</h3>
        </div>
        <div className="thirdBox">
          <p>Registered Admins</p>
          <h3>{totalDoctors}</h3>
        </div>
      </div>

      <UserInfo />

      <div className="banner">
        <h5>Appointments</h5>
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                  <td>{appointment.appointment_date ? appointment.appointment_date.substring(0, 16) : 'N/A'}</td>
                  <td>
                    <select
                      className={
                        appointment.status === "Pending"
                          ? "value-pending"
                          : appointment.status === "Accepted"
                          ? "value-accepted"
                          : "value-rejected"
                      }
                      value={appointment.status}
                      onChange={(e) =>
                        handleUpdateStatus(appointment.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    {appointment.hasVisited ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Appointments Found!</p>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
