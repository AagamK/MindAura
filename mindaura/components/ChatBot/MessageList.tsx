import React from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.sender}`}>
          <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;