import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import {
  getUserMessages,
  checkUsernameExists,
  sendMessage,
  getMessagesBetweenUsers,
  getUserById,
} from "../services/api.js";

import "./Chats.css";

export default function Chats() {
  const [showCompose, setShowCompose] = useState(false);
  const [composeUsername, setComposeUsername] = useState("");
  const [recipientId, setRecipientId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // On page load, if the user is not logged in, redirect to the home page
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (!token || !id) {
      window.location.href = "/";
    }
  }, []);

  // On page load, fetch the user's messages, this will allow us to display recent chats
  useEffect(() => {
    async function fetchUserMessages() {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      if (token && id) {
        try {
          const userMessages = await getUserMessages(token, id);
          // Process messages to get unique other UIDs
          const myId = parseInt(id);
          const otherUIDs = [
            ...new Set(
              userMessages
                .map((msg) => (msg.fromUID === myId ? msg.toUID : msg.fromUID))
                .filter((uid) => uid !== myId)
            ),
          ];

          // Fetch user details for each other UID if not already in map
          const newUserMap = { ...userMap };
          const fetchPromises = otherUIDs.map(async (uid) => {
            if (!newUserMap[uid]) {
              const userDetails = await getUserById(token, uid);
              if (userDetails) {
                newUserMap[uid] = userDetails;
              }
            }
          });
          await Promise.all(fetchPromises);
          setUserMap(newUserMap);

          // Create recent chats
          const chats = otherUIDs.map((uid) => {
            const messagesWithUser = userMessages.filter(
              (msg) =>
                (msg.fromUID === myId && msg.toUID === uid) ||
                (msg.fromUID === uid && msg.toUID === myId)
            );
            const lastMsg = messagesWithUser.sort(
              (a, b) => new Date(b.sentDt) - new Date(a.sentDt)
            )[0];
            return {
              userId: uid,
              username: newUserMap[uid]?.username || "Unknown",
              email: newUserMap[uid]?.email || "",
              profilePicture: newUserMap[uid]?.profilePicture,
              lastMessage: lastMsg?.messageText || "",
              lastMessageTime: lastMsg?.sentDt || "",
            };
          });
          setRecentChats(chats);
        } catch (error) {
          console.error("Error fetching user messages:", error);
        }
      }
    }
    fetchUserMessages();
  }, [userMap]);

  // Open compose modal
  function openCompose() {
    setComposeUsername("");
    setShowCompose(true);
  }

  // Start a fresh chat with the provided username
  async function startChatWithUsername() {
    // check to see if username exists in the system

    const token = localStorage.getItem("token");
    const usernameExists = await checkUsernameExists(token, composeUsername);

    if (!usernameExists.exists) {
      alert("Username does not exist!");
      return;
    }

    setRecipientId(usernameExists.id);

    if (!composeUsername) return;
    setCurrentChat({
      name: composeUsername,
      email: composeUsername,
      isNew: true,
    });
    setShowCompose(false);
    setMessageText("");

    // Fetch the chat history with this user
    fetchChatHistory(usernameExists.id);
  }

  // Function to fetch chat history with a specific user
  async function fetchChatHistory(recipientId) {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    try {
      const messages = await getMessagesBetweenUsers(token, id, recipientId);
      setChatHistory(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }

  // Send message for current chat
  async function handleSend() {
    const token = localStorage.getItem("token");
    const messageData = {
      fromUID: parseInt(localStorage.getItem("id")),
      toUID: recipientId,
      messageText: messageText,
    };
    try {
      sendMessage(token, messageData);
      setMessageText("");
      // Refresh chat history
      fetchChatHistory(recipientId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  // If a chat is currently selected, re-fetch chat history every 5 seconds to simulate real-time updates
  useEffect(() => {
    let interval;
    if (currentChat && recipientId) {
      interval = setInterval(() => {
        fetchChatHistory(recipientId);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [currentChat, recipientId]);

  // Auto scroll to bottom of chat on new message
  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <>
      <div className="main flex flex-col h-screen">
        <div className="flex overflow-hidden relative">
          {/* Sidebar */}
          <div className={`w-64 md:w-1/4 fixed md:relative top-0 left-0 h-full bg-black transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
            <header className="p-5 flex justify-between items-center text-white text-center">
              <h1 className="text-2xl font-semibold text-white">Chatty</h1>
              <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-white">
                <IoClose size={24} />
              </button>
            </header>

            <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
              <div className="flex items-center mb-4 cursor-pointer p-2 rounded-md">
                <div className="flex-1">
                  <div className="text-neutral-200 font-medium mb-1">
                    Recent Chats
                  </div>
                  <div>
                    {recentChats.map((chat, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-neutral-700 rounded-md cursor-pointer"
                        onClick={() => {
                          setCurrentChat({
                            name: chat.username,
                            email: chat.email,
                          });
                          setRecipientId(chat.userId);
                          fetchChatHistory(chat.userId);
                          setIsMenuOpen(false); // Close menu on mobile after selecting
                        }}
                      >
                        <div className="d-flex">
                          <div className="w-12 h-12 rounded-full mr-3">
                            <img
                              src={
                                chat.profilePicture
                                  ? chat.profilePicture
                                  : "https://placehold.co/200x/FFFFFF/000000.svg?text=(•_•)&font=Lato"
                              }
                              alt="User Avatar"
                              className="w-12 h-12 rounded-full"
                            />
                          </div>
                          <div className="text-neutral-200 font-medium">
                            {chat.username}
                          </div>
                          <div className="text-neutral-400 text-sm truncate">
                            {chat.lastMessage}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop for mobile menu */}
          {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}></div>}

          {/* Main chat area */}
          <div className="flex-1 w-full md:w-auto">
            <header className="p-4 text-gray-900 flex items-center justify-between gap-4">
              <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-white mr-2">
                <GiHamburgerMenu size={24} />
              </button>
              <h1 className="text-2xl font-semibold text-neutral-100">
                {currentChat ? currentChat.name : "Select a chat"}
              </h1>
              <div className="flex items-center gap-2">
                <button onClick={openCompose} className="btn">
                  Compose
                </button>
              </div>
            </header>

            <div
              className="h-screen overflow-y-auto p-4 pb-36 chat-container"
              style={{ scrollBehavior: "smooth" }}
            >
              {/* received messages on the left side and sent messages on the right side */}
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.fromUID === parseInt(localStorage.getItem("id"))
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className=" text-neutral-900 p-3 rounded-lg max-w-xs">
                    <p
                      className={`p-3 rounded-lg ${
                        msg.fromUID === parseInt(localStorage.getItem("id"))
                          ? "bg-neutral-700 text-white"
                          : "bg-neutral-100 text-black"
                      }`}
                    >
                      {msg.messageText}
                    </p>
                    <div className="text-gray-500 text-xs mt-1 ml-2">
                      {msg.fromUID === parseInt(localStorage.getItem("id"))
                        ? "You"
                        : currentChat.name}{" "}
                      - {new Date(msg.sentDt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className=" p-4 absolute bottom-0 w-full md:w-3/4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={
                    currentChat
                      ? `Message ${currentChat.name}...`
                      : "Select or compose a chat..."
                  }
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={!currentChat}
                  className="w-full bg-transparent  p-2 rounded-md focus:outline-none focus:border-orange-500 text-white"
                />
                <button
                  onClick={handleSend}
                  disabled={!currentChat || !messageText}
                  className="btn"
                >
                  Send
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-black rounded-md p-6 w-96">
            <h2 className="text-lg font-semibold text-white mb-3">
              Compose New Message
            </h2>
            <label className="text-sm text-neutral-300">
              Recipient Username
            </label>
            <input
              type="text"
              value={composeUsername}
              onChange={(e) => setComposeUsername(e.target.value)}
              placeholder="supercooluser"
              className="w-full bg-transparent p-2 rounded-md my-2 text-white focus:outline-none focus:border-orange-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCompose(false)}
                className=" btn rounded-md  text-gray-900"
              >
                Cancel
              </button>
              <button onClick={startChatWithUsername} className="btn">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
