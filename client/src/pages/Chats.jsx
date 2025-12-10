import { useEffect, useState } from "react";
import { getUserDetails, getUserMessages } from "../services/api.js";

import "./Chats.css";

export default function Chats() {
  const [userDetails, setUserDetails] = useState(null);
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

  return <></>;
}
