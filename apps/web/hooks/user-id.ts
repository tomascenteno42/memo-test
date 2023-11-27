import { useEffect, useState } from "react";

function generateUniqueId() {
  return "user-" + Math.random().toString(36).substr(2, 9);
}

export function useUserId() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Check if user ID exists in local storage
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // If not, generate a new user ID and store it
      const newUserId = generateUniqueId();
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }
  }, []); // Only run this effect once on component mount

  return userId;
}
