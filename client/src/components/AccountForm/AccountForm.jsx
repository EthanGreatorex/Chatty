import React, { useState, useEffect } from "react";
import "./styles.css";
import { registerUser, loginUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { checkUsernameExists } from "../../services/api";

export default function AccountForm({ onBack = () => {} }) {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const IMG_API_KEY = "7d793a7ba60c9baf15a0b08e0c1a1ee0";

  const navigate = useNavigate();

  function navigateToChats() {
    navigate("/chats");
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (isRegister) {
      // Check to see if the username already exists
      const response = await checkUsernameExists(username);
      if (response.exists === false) {
        alert("Username already exists. Please choose a different one.");
        return;
      }
      // Register a new user
      try {
        const response = await registerUser({
          username,
          email,
          password,
          profilePicture,
        });
        // Store the token in local storage
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        // Store the user id in local storage
        if (response.id) {
          localStorage.setItem("id", response.id);
        }
        // Navigate to chats after successful login
        navigateToChats();
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      // Login an existing user
      try {
        const response = await loginUser({ username, email, password });

        if (response.msg) {
          alert("Incorrect email or password");
          return;
        }
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        // Store the user id in local storage
        if (response.id) {
          localStorage.setItem("id", response.id);
        }

        // Navigate to chats after successful login
        navigateToChats();
      } catch (error) {
        console.error("Error", error);
      }
    }
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onBack();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  return (
    // Tailwind css login and register form template with some custom styles.
    <div className="modal-backdrop" onClick={onBack}>
      <form
        className="form"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="close-btn" onClick={onBack}>
          x
        </button>
        {isRegister && (
          <>
            <div className="flex-column">
              <label>Name </label>
            </div>
            <div className="inputForm">
              <svg
                height="60"
                viewBox="0 -9 32 32"
                width="40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_3" data-name="Layer 3">
                  <path
                    fill="white"
                    d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"
                  ></path>
                </g>
              </svg>
              <input
                type="text"
                className="input"
                placeholder="Enter your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <svg
            height="20"
            viewBox="0 0 32 32"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Layer_3" data-name="Layer 3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
            </g>
          </svg>
          <input
            type="text"
            className="input"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {isRegister && (
          <>
            <div className="flex-column">
              <label>Profile Picture </label>
            </div>
            <div className="inputForm">
              <svg
                height="20"
                viewBox="0 0 24 24"
                width="20"
                className="field-icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m12 12c2.209137 0 4-1.790863 4-4s-1.790863-4-4-4-4 1.790863-4 4 1.790863 4 4 4zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0 8c-4.418278 0-8 3.581722-8 8h2c0-3.3137085 2.6862915-6 6-6s6 2.6862915 6 6h2c0-4.418278-3.581722-8-8-8z"></path>
              </svg>
              <input
                type="file"
                className="input p-2"
                accept=".jpg, .jpeg, .png"
                placeholder="Upload profile picture"
                onChange={handleFileChange}
              />
            </div>
          </>
        )}

        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <svg
            height="20"
            viewBox="-64 0 512 512"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
          </svg>
          <input
            type="password"
            className="input"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn form-btn" type="submit">
          {isRegister ? "Sign Up" : "Login"}
        </button>
        <p className="p">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="span"
            role="button"
            onClick={() => setIsRegister((s) => !s)}
            style={{ cursor: "pointer" }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </form>
    </div>
  );
}
