// view_budget.js
(function () {
  const userId = localStorage.getItem("user_id");
  if (!userId) { window.location.href = "index.html"; return; }

  window.addEventListener("DOMContentLoaded", fetchBudgetData);

  async function fetchBudgetData() {
    const el = document.getElementById("budgetDetails");
    if (!el) return;

    try {
      const res = await fetch("http://localhost:8080/budget", {
        method: "GET",
        headers: { "X-User-ID": userId }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const income  = data.income  || 0;
      const expense = data.expense || 0;
      const balance = income - expense;

      el.innerHTML = `
        <p>Total Income: Tk ${income.toLocaleString()}</p>
        <p>Total Expenses: Tk ${expense.toLocaleString()}</p>
        <p>Remaining Balance: Tk ${balance.toLocaleString()}</p>
      `;
    } catch (err) {
      el.textContent = "Failed to load budget data.";
      console.error("Fetch error:", err);
    }
  }
})();
