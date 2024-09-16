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
    return <p>Loading messages...</p>;
  }

  return (
    <div>
      <h2>Messages</h2>
      {messages.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.firstName}</td>
                <td>{message.lastName}</td>
                <td>{message.email}</td>
                <td>{message.phone}</td>
                <td>{message.message}</td>
                <td>{message.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};
export default Messages;
