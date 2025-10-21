
import { mockUserProfile } from "./mockUserData";;

export function fetchUserProfile(userId) {
  return new Promise((resolve, reject) => {
    // simulate API delay
    setTimeout(() => {
      if (userId === "123") {
        resolve(mockUserProfile);
      } else {
        reject(new Error("User not found"));
      }
    }, 1000);
  });
}