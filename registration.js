// registration.js
document.getElementById("registration-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const name     = document.getElementById("userName").value.trim();
  const email    = document.getElementById("email").value.trim();
  const errorEl  = document.getElementById("error-message");
  const btn      = this.querySelector("button[type='submit']");

  errorEl.textContent = "";

  if (!username || !password || !name || !email) {
    errorEl.textContent = "Please fill in all fields.";
    return;
  }

  btn.textContent = "Creating account…";
  btn.disabled = true;

  try {
    const res = await fetch("http://localhost:8080/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name, email })
    });

    if (res.ok) {
      // Show success then redirect
      errorEl.style.color = "var(--green)";
      errorEl.textContent = "✓ Account created! Redirecting to login…";
      setTimeout(() => window.location.href = "index.html", 1500);
    } else {
      const text = await res.text();
      errorEl.style.color = "var(--red)";
      errorEl.textContent = "Registration failed: " + (text || "Please try again.");
    }
  } catch (err) {
    console.error("Registration error:", err);
    errorEl.style.color = "var(--red)";
    errorEl.textContent = "Connection error. Is the server running?";
  } finally {
    btn.textContent = "Create account";
    btn.disabled = false;
  }
});
