import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Chat({ senderId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:9000/api/messages/${senderId}/${receiverId}`)
      .then(res => setMessages(res.data));
  }, [senderId, receiverId]);

  const sendMessage = () => {
    axios.post('http://localhost:9000/api/messages/send', {
      sender: senderId,
      receiver: receiverId,
      content: input
    }).then(() => {
      setInput('');
      setMessages(prev => [...prev, { sender: senderId, receiver: receiverId, content: input }]);
    });
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.sender === senderId ? 'You' : 'Them'}:</strong> {msg.content}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
