// addincome.js
(function () {
  const userId = localStorage.getItem("user_id");
  if (!userId) { window.location.href = "index.html"; return; }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
  });

  document.getElementById("income-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const incomeVal = document.getElementById("income").value.trim();
    const successEl = document.getElementById("success-msg");
    const errorEl   = document.getElementById("error-msg");
    const btn       = this.querySelector("button[type='submit']");

    successEl.style.display = "none";
    errorEl.textContent = "";

    const amount = parseFloat(incomeVal);
    if (!incomeVal || isNaN(amount) || amount < 0.01) {
      errorEl.textContent = "Please enter a valid amount (minimum 0.01 Tk).";
      return;
    }

    btn.textContent = "Adding…";
    btn.disabled = true;

    try {
      const res = await fetch("http://localhost:8080/add_income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(userId), amount: parseFloat(amount.toFixed(2)) })
      });

      if (res.ok) {
        document.getElementById("income").value = "";
        successEl.style.display = "flex";
        setTimeout(() => { successEl.style.display = "none"; }, 3000);
      } else {
        const err = await res.text();
        errorEl.textContent = "Failed to add income: " + (err || "Server error.");
      }
    } catch (error) {
      errorEl.textContent = "Connection error: " + error.message;
    } finally {
      btn.textContent = "Add Income";
      btn.disabled = false;
    }
  });
})();
