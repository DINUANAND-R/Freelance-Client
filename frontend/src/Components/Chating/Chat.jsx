// ✅ Chat.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import ChatComponent from '../Chating/ChatComponent'; // adjust path if needed

export default function Chat() {
  const location = useLocation();
  const { currentUserEmail, targetUserEmail } = location.state || {};

  console.log("Sender:", currentUserEmail);
  console.log("Receiver:", targetUserEmail);

  if (!currentUserEmail || !targetUserEmail) {
    return <div className="text-red-600 text-center mt-8">Invalid chat participants</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <ChatComponent
        currentUserEmail={currentUserEmail}
        targetUserEmail={targetUserEmail}
      />
    </div>
  );
}
