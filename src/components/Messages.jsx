import React, { useEffect, useState } from "react";
import { database } from "../FirebaseConfig"; // Import Firebase configuration
import { ref, onValue } from "firebase/database"; // Firebase methods for fetching data

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) {
    return <p style={styles.loadingText}>Loading messages...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Messages</h2>
      {messages.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>First Name</th>
              <th style={styles.th}>Last Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id} style={styles.tr}>
                <td style={styles.td}>{message.firstName}</td>
                <td style={styles.td}>{message.lastName}</td>
                <td style={styles.td}>{message.email}</td>
                <td style={styles.td}>{message.phone}</td>
                <td style={styles.td}>{message.message}</td>
                <td style={styles.td}>{new Date(message.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noMessages}>No messages found.</p>
      )}
    </div>
  );
};

// Styles using inline CSS in JS
const styles = {
  container: {
    padding: "20px",
    paddingLeft: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#36d7b7",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  },
  tr: {
    transition: "background-color 0.2s ease",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ccc",
    textAlign: "left",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#36d7b7",
  },
  noMessages: {
    textAlign: "center",
    fontSize: "18px",
    color: "#999",
    padding: "20px",
  },
};

// Adding hover effects for table rows
styles.tr[':hover'] = {
  backgroundColor: "#f1f1f1",
};

export default Messages;
