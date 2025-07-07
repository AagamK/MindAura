import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { sendMessageToAI } from '@/lib/firebase'; // Function to send message to AI and get response

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await sendMessageToAI(input);
      const botMessage = { text: aiResponse, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <MessageList messages={messages} />
      <form onSubmit={handleSendMessage} className="chatbot-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chatbot-input"
          disabled={loading}
        />
        <button type="submit" className="chatbot-send-button" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;