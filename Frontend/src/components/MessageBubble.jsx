import MessageStatus from "./MessageStatus";

export default function MessageBubble({ msg, theme }) {
  return (
    <div
      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} my-2 transition-all duration-300`}
    >
      <div
        className={`max-w-xs sm:max-w-md lg:max-w-lg ${
          msg.isOwn }`}
      >
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 transition-colors duration-300 ${
            msg.isOwn
              ? "bg-blue-600 text-white rounded-tr-none"
              : theme === "dark"
              ? "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
              : "bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-200"
          }`}
        >
          <p className="text-sm break-words">{msg.text}</p>
        </div>

        {/* Time + Status */}
        <div className="flex items-center space-x-1 mt-1 px-2">
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {msg.time}
          </p>
          {msg.isOwn && <MessageStatus status={msg.status} />}
        </div>
      </div>
    </div>
  );
}
