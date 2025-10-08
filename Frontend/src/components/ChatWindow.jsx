import { ArrowLeft, Send } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({
  selectedContact,
  selectedChat,
  conversations,
  isTyping,
  message,
  setMessage,
  handleSendMessage,
  handleKeyPress,
  setSelectedChat,
  messagesEndRef,
  theme, 
}) {
  const chatMessages = conversations[selectedChat] || [];

  return (
    <div
      className={`flex-1 flex flex-col transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 flex-shrink-0 shadow-sm border-b transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          {/* Back button (mobile only) */}
          <button
            onClick={() => setSelectedChat(null)}
            className={`lg:hidden p-2 rounded-lg -ml-2 transition-all ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-200"
                : "hover:bg-gray-100 text-gray-800"
            }`}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full ${selectedContact?.color} flex items-center justify-center font-semibold`}
            >
              {selectedContact?.avatar}
            </div>
            {selectedContact?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white "></div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2
              className={`font-semibold ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {selectedContact?.name}
            </h2>
            <p
              className={`text-sm transition-colors ${
                isTyping
                  ? "text-blue-500"
                  : theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {isTyping ? "typing..." : selectedContact?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {chatMessages.length === 0 ? (
          <div
            className={`flex items-center justify-center h-full ${
              theme === "dark" ? "text-gray-500" : "text-gray-600"
            }`}
          >
            Start a conversation with {selectedContact?.name}
          </div>
        ) : (
          <>
            {chatMessages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} theme={theme} />
            ))}
            {isTyping && <TypingIndicator theme={theme} />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div
        className={`p-4 flex-shrink-0 border-t transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500"
            }`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
