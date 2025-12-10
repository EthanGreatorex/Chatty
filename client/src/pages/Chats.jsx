import { useEffect, useState } from "react";
import {
  getUserDetails,
  getUserMessages,
  checkUsernameExists,
} from "../services/api.js";

import "./Chats.css";

export default function Chats() {
  const [userDetails, setUserDetails] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeUsername, setComposeUsername] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  // On page load, fetch the user's profile details
  useEffect(() => {
    async function fetchUserDetails() {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      if (token && id) {
        try {
          const userDetails = await getUserDetails(token, id);
          setUserDetails(userDetails);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    }
    fetchUserDetails();
  }, []);

  // On page load, fetch the user's messages
  useEffect(() => {
    async function fetchUserMessages() {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      console.log("Fetching messages with token:", token, "and id:", id);
      if (token && id) {
        try {
          const userMessages = await getUserMessages(token, id);
          console.log("User Messages:", userMessages);
        } catch (error) {
          console.error("Error fetching user messages:", error);
        }
      }
    }
    fetchUserMessages();
  }, []);

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

    console.log("Username exists:", usernameExists);

    if (!composeUsername) return;
    setCurrentChat({
      name: composeUsername,
      email: composeUsername,
      isNew: true,
    });
    setShowCompose(false);
    setMessageText("");
  }

  // Send message for current chat
  async function handleSend() {
    const token = localStorage.getItem("token");
    const fromId = localStorage.getItem("id");
  }

  return (
    <>
      <div className="main flex flex-col  h-screen bg-neutral-900">
        <div className="flex  overflow-hidden">
          <div className="w-1/4 bg-transparent border-r border-purple-800">
            <header className="p-5 border-b border-purple-800 flex justify-between items-center bg-purple-800 text-white">
              <h1 className="text-2xl font-semibold text-white">Chatty</h1>
            </header>

            <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
              <div className="flex items-center mb-4 cursor-pointer hover:bg-purple-800 p-2 rounded-md">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                  <img
                    src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">Bob</h2>
                  <p className="text-gray-300">Hoorayy!!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <header className="bg-transparent p-4 text-gray-700 flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-white">
                {currentChat ? currentChat.name : "Select a chat"}
              </h1>
              <div className="flex items-center gap-2">
                <button onClick={openCompose} className="btn">
                  Compose
                </button>
              </div>
            </header>

            <div className="h-screen overflow-y-auto p-4 pb-36"></div>

            <footer className="bg-transparent p-4 absolute bottom-0 w-3/4">
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
                  className="w-full bg-black border-none p-2 rounded-md border focus:outline-none focus:border-purple-500 text-white"
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
      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-neutral-900 rounded-md p-6 w-96">
            <h2 className="text-lg font-semibold text-white mb-3">
              Compose New Message
            </h2>
            <label className="text-sm text-gray-300">Recipient Username</label>
            <input
              type="email"
              value={composeUsername}
              onChange={(e) => setComposeUsername(e.target.value)}
              placeholder="supercooluser"
              className="w-full bg-black border-none p-2 rounded-md my-2 text-white"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCompose(false)}
                className="px-3 py-1 rounded-md border border-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={startChatWithUsername}
                className="btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
