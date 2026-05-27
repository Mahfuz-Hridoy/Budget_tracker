// script.js — Dashboard logic
document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    window.location.href = "index.html";
    return;
  }

  // Greeting
  const hour = new Date().getHours();
  const greetEl = document.getElementById("greeting");
  if (greetEl) {
    greetEl.textContent = hour < 12 ? "Good morning!" : hour < 18 ? "Good afternoon!" : "Good evening!";
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user_id");
      window.location.href = "index.html";
    });
  }

  fetchBudgetData(userId);
});

async function fetchBudgetData(userId) {
  const incomeEl  = document.getElementById("incomeAmt");
  const expenseEl = document.getElementById("expenseAmt");
  const balanceEl = document.getElementById("balanceAmt");

  if (!incomeEl) return;

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

    incomeEl.textContent  = `${income.toLocaleString()} Tk`;
    expenseEl.textContent = `${expense.toLocaleString()} Tk`;
    balanceEl.textContent = `${balance.toLocaleString()} Tk`;
  } catch (err) {
    [incomeEl, expenseEl, balanceEl].forEach(el => { if (el) el.textContent = "Error"; });
    console.error("Dashboard fetch error:", err);
  }
}
