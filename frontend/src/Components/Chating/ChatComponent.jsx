import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function ChatComponent({ currentUserEmail, targetUserEmail }) {
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.current = io('http://localhost:9000', {
      transports: ['websocket'],
    });

    socket.current.emit('join', currentUserEmail);

    fetch(`http://localhost:9000/api/messages/${currentUserEmail}/${targetUserEmail}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Message fetch failed:', err));

    socket.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUserEmail, targetUserEmail]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMsg = {
      senderEmail: currentUserEmail,
      receiverEmail: targetUserEmail,
      messageText: message.trim(),
      timestamp: new Date(),
    };

    socket.current.emit('sendMessage', newMsg);
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 text-lg font-semibold flex justify-between items-center">
          <div>Chat with {targetUserEmail}</div>
          <div className="text-sm text-blue-200">{currentUserEmail}</div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 custom-scroll">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.senderEmail === currentUserEmail ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-sm px-4 py-2 rounded-lg text-sm shadow ${
                  msg.senderEmail === currentUserEmail
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div>{msg.messageText}</div>
                <div className="text-[10px] mt-1 text-right opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex items-center border-t px-4 py-3 gap-3 bg-white">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
