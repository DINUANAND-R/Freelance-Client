import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecentChats({ currentUserEmail }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://freelance-client-3029.onrender.com/api/messages/recent/${currentUserEmail}`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Failed to fetch recent chats:', err));
  }, [currentUserEmail]);

  const handleChatClick = (email) => {
    navigate(`/chat/${email}`); // assumes your route is like `/chat/:targetUserEmail`
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Recent Chats</h2>
      {users.map(user => (
        <div
          key={user.email}
          onClick={() => handleChatClick(user.email)}
          className="flex items-center gap-4 cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition"
        >
          <img
            src={user.photo || 'https://via.placeholder.com/40'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
