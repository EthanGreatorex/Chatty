// This file contains all the services related to API calls

const API_BASE = "http://localhost:3000";

// Login a user
// details will include an email and password
export async function loginUser(details) {
  try {
    const response = await fetch(`${API_BASE}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });
    console.log("Response", response);
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Register a new user
// details will include a username, email, password, and optionally profilePicture as URL
export async function registerUser(details) {
  try {
    const response = await fetch(`${API_BASE}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Delete a user
export async function deleteUser(token, id) {
  try {
    const response = await fetch(`${API_BASE}/api/users//delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Get user details
export async function getUserDetails(token, id) {
  console.log("getUserDetails called");
  try {
    const response = await fetch(`${API_BASE}/api/users/me/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Get user by ID
export async function getUserById(token, id) {
  console.log("getUserbyId called");
  try {
    const response = await fetch(`${API_BASE}/api/users/me/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Get user messages
export async function getUserMessages(token, id) {
  console.log("getUserMessages called");
  try {
    const response = await fetch(`${API_BASE}/api/messages/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Get messages between two users
export async function getMessagesBetweenUsers(token, userOneID, userTwoID) {
  console.log("getmessagesBetweenUsers called");
  try {
    const response = await fetch(
      `${API_BASE}/api/messages/between/${userOneID}/${userTwoID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Send a new message
export async function sendMessage(token, messageData) {
  try {
    const response = await fetch(`${API_BASE}/api/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// check to see if a username exists
export async function checkUsernameExists(token, username) {
  console.log("checkUsernameExists called");
  try {
    const response = await fetch(`${API_BASE}/api/users/exists/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}
