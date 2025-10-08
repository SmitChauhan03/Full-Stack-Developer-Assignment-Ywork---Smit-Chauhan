import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { contacts, botReplies } from "./data/contacts";
import { getCurrentTime, getRandomReply } from "./utils/helpers";

export default function ChatApp() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // 🌓
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [conversations, selectedChat, isTyping]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleSelectContact = (id) => {
    setSelectedChat(id);
    setIsSidebarOpen(false);
    if (!conversations[id])
      setConversations((prev) => ({ ...prev, [id]: [] }));
  };

  const updateMessageStatus = (id, msgId, status) => {
    setConversations((prev) => ({
      ...prev,
      [id]: prev[id].map((m) => (m.id === msgId ? { ...m, status } : m)),
    }));
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now(),
      text: message,
      time: getCurrentTime(),
      isOwn: true,
      status: "sent",
    };

    setConversations((p) => ({
      ...p,
      [selectedChat]: [...(p[selectedChat] || []), newMsg],
    }));
    setMessage("");

    // Simulate message delivery statuses
    setTimeout(() => updateMessageStatus(selectedChat, newMsg.id, "received"), 500);
    setTimeout(() => updateMessageStatus(selectedChat, newMsg.id, "read"), 1000);

    const contact = contacts.find((c) => c.id === selectedChat);
    if (contact?.online) {
      setTimeout(() => setIsTyping(true), 1500);
      setTimeout(() => {
        setIsTyping(false);
        const reply = {
          id: Date.now() + 1,
          text: getRandomReply(botReplies, message),
          time: getCurrentTime(),
          isOwn: false,
          status: "read",
        };
        setConversations((p) => ({
          ...p,
          [selectedChat]: [...(p[selectedChat] || []), reply],
        }));
      }, 3000);
    }
  };

  const getLastMessage = (id) => {
    const msgs = conversations[id];
    if (!msgs?.length) return "No messages yet";
    const last = msgs[msgs.length - 1].text;
    return last.length > 30 ? last.slice(0, 30) + "..." : last;
  };

  const getLastMessageTime = (id) => {
    const msgs = conversations[id];
    return msgs?.length ? msgs[msgs.length - 1].time : "";
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContact = contacts.find((c) => c.id === selectedChat);

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Navbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearch={setSearchTerm}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="flex flex-1 mt-14 overflow-hidden">
        <Sidebar
          contacts={filteredContacts}
          selectedChat={selectedChat}
          onSelectChat={handleSelectContact}
          getLastMessage={getLastMessage}
          getLastMessageTime={getLastMessageTime}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={setIsSidebarOpen}
        />

        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <ChatWindow
              selectedContact={selectedContact}
              selectedChat={selectedChat}
              conversations={conversations}
              isTyping={isTyping}
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              handleKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              setSelectedChat={setSelectedChat}
              messagesEndRef={messagesEndRef}
              theme={theme}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 ">
                  💬
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Welcome to Chat App
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a contact from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
