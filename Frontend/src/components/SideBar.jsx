import React from "react";
export default function Sidebar({
  contacts,
  selectedChat,
  onSelectChat,
  getLastMessage,
  getLastMessageTime,
  theme,
  isSidebarOpen,
  toggleSidebar,      
}) {
  return (
    <>
      {/* Sidebar panel */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 mt-14 lg:mt-0
          w-80 transform transition-all duration-300 ease-in-out z-40 flex flex-col
          ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} border-r`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Chats
          </h2>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div
              className={`flex items-center justify-center h-full text-sm ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            >
              No contacts found
            </div>
          ) : (
            contacts.map((contact) => {
              const isSelected = selectedChat === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    onSelectChat(contact.id);
                    toggleSidebar(false); 
                  }}
                  className={`
                    p-4 border-b cursor-pointer transition-all duration-200
                    flex items-start space-x-3
                    ${
                      theme === "dark"
                        ? `border-gray-800 hover:bg-gray-800 ${
                            isSelected
                              ? "bg-blue-900/40 border-l-4 border-l-blue-500"
                              : ""
                          }`
                        : `border-gray-100 hover:bg-gray-50 ${
                            isSelected
                              ? "bg-blue-50 border-l-4 border-l-blue-600"
                              : ""
                          }`
                    }
                  `}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full ${contact.color} flex items-center justify-center font-semibold transition-transform hover:scale-105`}
                    >
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white "></div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-semibold truncate ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {contact.name}
                      </h3>
                      <span
                        className={`text-xs ml-2 flex-shrink-0 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {getLastMessageTime(contact.id)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {getLastMessage(contact.id)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => toggleSidebar(false)} 
        ></div>
      )}
    </>
  );
}
