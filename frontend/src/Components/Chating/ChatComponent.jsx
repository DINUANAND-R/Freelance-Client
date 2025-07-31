import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

export default function ChatComponent({ currentUserEmail, targetUserEmail }) {
  const socket = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to Socket.IO server
    socket.current = io('http://localhost:9000', {
      transports: ['websocket'],
    });

    // Join user's email room
    socket.current.emit('join', currentUserEmail);

    // Fetch message history between current user and target user
    axios
      .get(`http://localhost:9000/api/messages/${currentUserEmail}/${targetUserEmail}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Failed to fetch messages', err));

    // Listen for new incoming messages
    socket.current.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Clean up on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [currentUserEmail, targetUserEmail]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMsg = {
      senderEmail: currentUserEmail,
      receiverEmail: targetUserEmail,
      messageText: message.trim(),
      timestamp: new Date(),
    };
     console.log(currentUserEmail);
      console.log(targetUserEmail);
    // Emit message through socket
    socket.current.emit('sendMessage', newMsg);

    try {
      // Store message in database
      await axios.post('http://localhost:9000/api/messages/send', newMsg);
    } catch (error) {
      console.error('Failed to store message', error);
    }

    // Update UI and clear input
    setMessages((prev) => [...prev, newMsg]);
    setMessage('');
  };

  return (
    <div className="p-4 border rounded w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Chat with {targetUserEmail}</h2>
      <div className="h-64 overflow-y-scroll border p-2 bg-gray-100 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.senderEmail === currentUserEmail ? 'text-right' : 'text-left'}`}
          >
            <span className="block p-2 bg-white rounded shadow">{msg.messageText}</span>
            <small className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
