import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Circle } from 'lucide-react';

export default function ChatComponent({ currentUserEmail, targetUserEmail }) {
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [targetUserIsOnline, setTargetUserIsOnline] = useState(false);
  const [targetUser, setTargetUser] = useState({ name: targetUserEmail.split('@')[0] });

  useEffect(() => {
    socket.current = io('http://localhost:9000', { transports: ['websocket'] });

    // Handle socket connection status
    socket.current.on('connect', () => {
      setIsSocketConnected(true);
      socket.current.emit('join', currentUserEmail);
    });

    socket.current.on('disconnect', () => {
      setIsSocketConnected(false);
      setTargetUserIsOnline(false); // Assume offline on disconnect
    });

    // Listen for the other user's online/offline status
    socket.current.on('userStatus', ({ email, isOnline }) => {
      if (email === targetUserEmail) {
        setTargetUserIsOnline(isOnline);
      }
    });

    // Fetch historical messages
    setIsLoading(true);
    fetch(`http://localhost:9000/api/messages/${currentUserEmail}/${targetUserEmail}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Message fetch failed:', err))
      .finally(() => setIsLoading(false));

    // Fetch user details (you would typically do this from an API)
    // For this example, we'll just set the name from the email
    // fetch(`http://localhost:9000/api/users/${targetUserEmail}`)
    //   .then(res => res.json())
    //   .then(user => setTargetUser(user))
    //   .catch(err => console.error('User fetch failed:', err));


    // Listen for new messages
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
    if (!message.trim() || !isSocketConnected) return;

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

  const renderTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 flex flex-col max-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-600 hover:text-teal-600 transition-colors duration-200"
            >
              <ArrowLeft size={28} />
            </button>
            <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-teal-800 font-bold">
              {targetUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-slate-900">{targetUser.name}</h2>
              <div className="flex items-center gap-1 text-sm">
                <Circle 
                  size={12} 
                  className={`transition-colors duration-200 ${targetUserIsOnline ? 'text-green-500 fill-green-500' : 'text-slate-400 fill-slate-400'}`} 
                />
                <span className="text-slate-500">
                  {targetUserIsOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isSocketConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isSocketConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-100">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 size={48} className="animate-spin text-teal-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-slate-500 italic">
              Start a new conversation.
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex transform transition-all duration-300 animate-slide-in ${
                  msg.senderEmail === currentUserEmail ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xl px-5 py-3 rounded-2xl shadow-md text-lg animate-fade-in ${
                    msg.senderEmail === currentUserEmail
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                  }`}
                >
                  <div>{msg.messageText}</div>
                  <div className={`text-xs mt-1 text-right ${msg.senderEmail === currentUserEmail ? 'text-teal-100' : 'text-slate-500'}`}>
                    {renderTimestamp(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex items-center gap-4 border-t border-slate-200 px-8 py-5 bg-white shadow-top sticky bottom-0 z-10">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-grow px-5 py-3 text-lg border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors duration-200"
            disabled={!isSocketConnected}
          />
          <button
            onClick={handleSend}
            className={`bg-teal-600 text-white px-8 py-3 text-lg rounded-full font-semibold transition-colors duration-200 shadow-md ${!isSocketConnected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'}`}
            disabled={!isSocketConnected}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}