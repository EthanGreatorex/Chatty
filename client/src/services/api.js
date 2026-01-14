// This file contains all the services related to API calls

// const API_BASE = "https://chatty-production-9838.up.railway.app";
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
      credentials: "include",
      body: JSON.stringify(details),
    });
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
      credentials: "include",
      body: JSON.stringify(details),
    });
    if (!response.ok) {
      return { error: "User already exists" };
    }
    return await response.json();
  } catch (error) {
    alert("Error", error);
  }
}

// Delete a user
export async function deleteUser(id) {
  try {
    const response = await fetch(`${API_BASE}/api/users/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Update user details
export async function updateUserDetails(id, updatedDetails) {
  try {
    const response = await fetch(`${API_BASE}/api/users/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedDetails),
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}
// Get user details
export async function getUserDetails(id) {
  try {
    const response = await fetch(`${API_BASE}/api/users/me/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id) {
  try {
    const response = await fetch(`${API_BASE}/api/users/me/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Get user messages
export async function getUserMessages(id) {
  try {
    const response = await fetch(`${API_BASE}/api/messages/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Get messages between two users
export async function getMessagesBetweenUsers(userOneID, userTwoID) {
  try {
    const response = await fetch(
      `${API_BASE}/api/messages/between/${userOneID}/${userTwoID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// Send a new message
export async function sendMessage(messageData) {
  try {
    const response = await fetch(`${API_BASE}/api/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(messageData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

// check to see if a username exists
export async function checkUsernameExists(username) {
  try {
    const response = await fetch(`${API_BASE}/api/users/exists/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error", error);
    return { exists: false };
  }
}
