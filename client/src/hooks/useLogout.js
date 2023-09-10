import { BASE_URL } from "config";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.tokens.refresh.token) {
      // Make a POST request to the logout API
      try {
        const response = await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: user.tokens.refresh.token }),
        });

        if (response.ok) {
          // Remove user from local storage
          localStorage.removeItem("user");

          // Dispatch logout
          dispatch({ type: "LOGOUT" });
        } else {
          // Handle error if logout API call fails
          console.error("Logout API request failed");
        }
      } catch (error) {
        console.error("Error while making logout API request", error);
      }
    }
  };

  return { logout };
};
