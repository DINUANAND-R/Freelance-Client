// src/pages/ChatComponentWrapper.js
import { useLocation } from 'react-router-dom';
import ChatComponent from './ChatComponent';

export default function ChatComponentWrapper() {
  const location = useLocation();
  const { currentUserEmail, targetUserEmail } = location.state || {};

  if (!currentUserEmail || !targetUserEmail) {
    return <p className="text-center text-red-500">Missing chat details.</p>;
  }

  return (
    <ChatComponent
      currentUserEmail={currentUserEmail}
      targetUserEmail={targetUserEmail}
    />
  );
}
