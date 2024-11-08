export async function checkAuth(): Promise<boolean> {
  // Check if the user is authenticated by checking for a token in localStorage
  const token = localStorage.getItem("token");
  return !!token;
}

export async function createGuestAccount(): Promise<void> {
  let token = localStorage.getItem("token");
  if (token) {
    return;
  }
  // Create a guest account by sending a POST request to the server
  const response = await fetch("http://localhost:8080/api/auth/guest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Get the token from the response headers
        const authHeader = response.headers.get("Authorization");
        if (authHeader) {
          token = authHeader.split(" ")[1];
        } else {
          console.error("Authorization header is missing");
        }
        // Save the token in localStorage
        if (token) {
          localStorage.setItem("token", token);
        } else {
          console.error("Token is null");
        }
      } else {
        console.error("Failed to get guest token");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
