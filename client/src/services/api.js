// This file contains all the services related to API calls

// Login a user
// details will include an email and password
export async function loginUser(details) {
  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
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

// Register a new user
// details will include a username, email and password
export async function registerUser(details) {
  try {
    const response = await fetch("http://localhost:3000/api/users/register", {
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

// Get user details
export async function getUserDetails(token, id) {
  try {
    const response = await fetch(`http://localhost:3000/api/users/me/${id}`, {
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
  console.log("API Call - getUserMessages with token:", token, "and id:", id);
  try {
    const response = await fetch(`http://localhost:3000/api/messages/${id}`, {
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
