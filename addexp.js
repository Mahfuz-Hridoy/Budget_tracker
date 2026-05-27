// addexp.js
(function () {
  const userId = localStorage.getItem("user_id");
  if (!userId) { window.location.href = "index.html"; return; }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
  });

  document.getElementById("expense-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const expenseName = document.getElementById("expenseName").value.trim();
    const expenseVal  = document.getElementById("expense").value.trim();
    const successEl   = document.getElementById("success-msg");
    const errorEl     = document.getElementById("error-msg");
    const btn         = this.querySelector("button[type='submit']");

    successEl.style.display = "none";
    errorEl.textContent = "";

    if (!expenseName) { errorEl.textContent = "Please enter an expense name."; return; }

    const amount = parseFloat(expenseVal);
    if (!expenseVal || isNaN(amount) || amount < 0.01) {
      errorEl.textContent = "Please enter a valid amount (minimum 0.01 Tk).";
      return;
    }

    btn.textContent = "Adding…";
    btn.disabled = true;

    try {
      const res = await fetch("http://localhost:8080/add_expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId),
          amount: parseFloat(amount.toFixed(2)),
          name: expenseName
        })
      });

      if (res.ok) {
        document.getElementById("expense").value = "";
        document.getElementById("expenseName").value = "";
        successEl.style.display = "flex";
        setTimeout(() => { successEl.style.display = "none"; }, 3000);
      } else {
        const errText = await res.text();
        errorEl.textContent = "Failed to add expense: " + (errText || "Server error.");
      }
    } catch (err) {
      errorEl.textContent = "Connection error: " + err.message;
    } finally {
      btn.textContent = "Add Expense";
      btn.disabled = false;
    }
  });
})();
