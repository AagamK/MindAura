import { useEffect, useState } from "react";
import { ChatBot } from "@/components/ChatBot/ChatBot";
import { MessageList } from "@/components/ChatBot/MessageList";
import { useAuth } from "@/lib/auth";
import { getMessages, sendMessage } from "@/lib/realtime";

export default function ChatPage() {
  const { isLoggedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const initialMessages = await getMessages();
      setMessages(initialMessages);
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: "user" };
      await sendMessage(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Chat with MindAura</h1>
      {isLoggedIn ? (
        <div className="flex flex-col">
          <MessageList messages={messages} />
          <div className="flex mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md p-2"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white rounded-r-md px-4"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Please log in to start chatting.</p>
      )}
    </div>
  );
}