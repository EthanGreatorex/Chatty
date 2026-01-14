import "./Settings.css";
import {
  getUserDetails,
  deleteUser,
  updateUserDetails,
  checkUsernameExists,
} from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [userDetails, setUserDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");

  const navigate = useNavigate();

  const IMG_API_KEY = "7d793a7ba60c9baf15a0b08e0c1a1ee0";

  // Fetch the user details on page load
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      if (!token || !userId) {
        navigate("/");
        return;
      }
      try {
        const userDetails = await getUserDetails(token, userId);
        setUserDetails(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
        // If authentication fails, redirect to home
        if (
          error.message.includes("401") ||
          error.message.includes("Unauthorized")
        ) {
          localStorage.clear();
          navigate("/");
        }
      }
    };
    fetchUserDetails();
  }, [navigate]);

  // This will handle profile picture uploads

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("key", IMG_API_KEY);
      formData.append("image", file);
      try {
        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          setProfilePicture(data.data.url);
        } else {
          console.error("Upload failed:", data);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  }

  // Function to handle account deletion
  async function handleDeleteAccount() {
    // Ask for confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    try {
      await deleteUser(token, userId);

      // Clear local storage and redirect to home page
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  }

  // Handle the cancel or save changes option, choice is either 'cancel' or 'save'
  async function handleChoice(choice) {
    var isValidUpdate = true;
    if (choice === "cancel") {
      navigate("/chats");
    } else if (choice === "save") {
      if (!userDetails) {
        alert(
          "User details are still loading. Please wait a moment and try again."
        );
        return;
      }
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      var username = document.querySelector('input[type="text"]').value;

      // only if the user has entered a new username
      if (username && username !== userDetails.username) {
        // Check to see if the username already exists
        const response = await checkUsernameExists(username, token);
        if (response.exists === true) {
          alert("Username already exists. Please choose a different one.");
          isValidUpdate = false;
          
        }

        if (username.trim() === "") {
          username = userDetails.username;
        }
      }

      if (isValidUpdate === false) return;
      else {
        const updatedDetails = {
          username: (username || userDetails.username).trim(),
          profilePicture: (profilePicture || userDetails.profilePicture).trim(),
        };
        await updateUserDetails(token, userId, updatedDetails);
        navigate("/chats");
      }
    }
  }
  return (
    <>
      <div className="main flex flex-col  items-center h-screen bg-black">
        <h1 className="text-3xl mt-5 text-white font-bold">Settings Page</h1>
        <div className="flex   mt-10 flex-col">
          <img
            src={
              userDetails?.profilePicture ||
              profilePicture ||
              "https://placehold.co/200x/FFFFFF/000000.svg?text=(•_•)&font=Lato"
            }
            alt="user profile picture"
            className="w-20 h-20 rounded-full"
          />
          <p className="text-gray-300">Profile picture</p>

          <label
            className="block mb-2.5 text-sm font-medium text-heading"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="cursor-pointer bg-neutral-secondary-medium text-heading text-gray-300 text-sm rounded-base focus:ring-brand focus:border-brand block w-full shadow-xs placeholder:text-body"
            id="file_input"
            type="file"
            onChange={handleFileChange}
          />

          <h2 className="text-white text-xl mt-4">Username</h2>
          <input
            type="text"
            placeholder={userDetails?.username}
            className="rounded-[0.2rem] mt-2 bg-transparent border p-2 text-white"
          />

          <h2 className="text-white text-xl mt-6">Delete Account</h2>
          <button
            className="text-black bg-red-700 p-2 text-md rounded-[0.5rem] mt-2"
            onClick={handleDeleteAccount}
          >
            Delete
          </button>
          <div className="flex gap-4 mt-6">
            <button className="btn mt-2" onClick={() => handleChoice("cancel")}>
              Cancel
            </button>
            <button className="btn mt-2" onClick={() => handleChoice("save")}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
