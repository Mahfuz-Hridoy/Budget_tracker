// view_all_exp.js
(function () {
  const userId = localStorage.getItem("user_id");
  if (!userId) { window.location.href = "index.html"; return; }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
  });

  window.addEventListener("DOMContentLoaded", fetchAllExpenses);

  async function fetchAllExpenses() {
    const list = document.getElementById("expenseList");
    list.innerHTML = `<li><span class="loading-state"><span class="spinner"></span> Loading expenses…</span></li>`;

    try {
      const res = await fetch("http://localhost:8080/all_expenses", {
        method: "GET",
        headers: { "X-User-ID": userId }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const expenses = await res.json();
      list.innerHTML = "";

      if (!expenses || expenses.length === 0) {
        list.innerHTML = `<li style="color:var(--text-secondary); padding:1rem; text-align:center;">No expenses recorded yet.</li>`;
        return;
      }

      expenses.forEach(exp => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="exp-name">${exp.name || "Unnamed"}</span>
          <span class="exp-amount">Tk ${(exp.amount || 0).toLocaleString()}</span>
        `;
        list.appendChild(li);
      });

    } catch (err) {
      list.innerHTML = `<li style="color:var(--red); padding:1rem;">Failed to load expenses. Is the server running?</li>`;
      console.error("Fetch error:", err);
    }
  }
})();
