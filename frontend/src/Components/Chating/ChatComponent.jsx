import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ChatComponent({ currentUserEmail, targetUserEmail }) {
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.current = io('http://localhost:9000', { transports: ['websocket'] });

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
        
        {/* Header */}
        <div className="bg-white border-b px-8 py-6 flex items-center gap-6 shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeft size={32} />
          </button>
          <div className="text-2xl font-bold text-gray-800">
            Chat with {targetUserEmail}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-10 py-6 space-y-6 bg-gradient-to-br from-blue-50 to-white text-lg">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.senderEmail === currentUserEmail ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-md px-6 py-4 rounded-3xl text-lg shadow-lg ${
                  msg.senderEmail === currentUserEmail
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <div>{msg.messageText}</div>
                <div className="text-[12px] mt-2 text-right opacity-70">
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

        {/* Input */}
        <div className="flex items-center gap-4 border-t px-8 py-5 bg-white">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full font-semibold transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
