// login.js
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorEl  = document.getElementById("error-message");
  const btn      = this.querySelector("button[type='submit']");

  errorEl.textContent = "";

  if (!username || !password) {
    errorEl.textContent = "Please enter both username and password.";
    return;
  }

  btn.textContent = "Signing in…";
  btn.disabled = true;

  try {
    const response = await fetch("http://localhost:8080/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user_id", data.user_id);
      window.location.href = "main.html";
    } else {
      const errorText = await response.text();
      errorEl.textContent = "Login failed: " + (errorText || "Invalid credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    errorEl.textContent = "Connection error. Is the server running?";
  } finally {
    btn.textContent = "Sign in";
    btn.disabled = false;
  }
});
