
const budgetSlider = document.getElementById("budgetSlider");
const expenseInput = document.getElementById("expenseInput");
const updateButton = document.getElementById("updateButton");

const money = (amount) =>
  "₹" + Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 0
  });

const number = (amount) =>
  Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 0
  });

let monthlyBudget = Number(budgetSlider.value);
let estimatedExpenses = Number(expenseInput.value);

function updateDashboard() {

  const remaining = monthlyBudget - estimatedExpenses;
  const overBudget = remaining < 0;
  const utilization =
    (estimatedExpenses / monthlyBudget) * 100;

  const safe = !overBudget;

  // Summary cards
  document.getElementById("monthlyBudget").textContent =
    money(monthlyBudget);

  document.getElementById("estimatedExpenses").textContent =
    money(estimatedExpenses);

  document.getElementById("remainingBalance").textContent =
    money(remaining);

  document.getElementById("remainingBalance")
    .classList.toggle("balance", safe);

  // Potentiometer
  document.getElementById("sliderBudget").textContent =
    money(monthlyBudget);

  // OLED display
  document.getElementById("oledBudget").textContent =
    number(monthlyBudget);

  document.getElementById("oledExpense").textContent =
    number(estimatedExpenses);

  document.getElementById("oledBalance").textContent =
    number(remaining);

  document.getElementById("oledStatus").textContent =
    overBudget ? "STATUS: OVER BUDGET" : "STATUS: SAFE";

  // Budget utilization
  document.getElementById("utilizationText").textContent =
    utilization.toFixed(1) + "%";

  const bar = document.getElementById("utilizationBar");

  bar.style.width = Math.min(utilization, 100) + "%";

  bar.style.background =
    overBudget ? "var(--red)" : "var(--green)";

  // LED indicators
  document.getElementById("greenLED")
    .classList.toggle("active", safe);

  document.getElementById("redLED")
    .classList.toggle("active", overBudget);

  document.getElementById("greenText").textContent =
    safe ? "ACTIVE - SAFE" : "INACTIVE";

  document.getElementById("redText").textContent =
    overBudget ? "ACTIVE - OVER BUDGET" : "INACTIVE";

  // Alert message
  const alert = document.getElementById("alertMessage");

  alert.classList.toggle("safe", safe);
  alert.classList.toggle("danger", overBudget);

  document.getElementById("alertTitle").textContent =
    safe ? "✓ Budget Under Control" : "⚠ Budget Limit Exceeded";

  document.getElementById("alertDescription").textContent =
    safe
      ? "You have " + money(remaining) +
        " remaining in your monthly budget."
      : "You are over your monthly budget by " +
        money(Math.abs(remaining)) + ".";
}

// Potentiometer slider
budgetSlider.addEventListener("input", () => {

  monthlyBudget = Number(budgetSlider.value);

  updateDashboard();

});

// Update expenses
function applyExpenses() {

  const value = Number(expenseInput.value);

  const error = document.getElementById("inputError");

  if (
    expenseInput.value.trim() === "" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    error.textContent =
      "Please enter a valid expense amount (zero or more).";
    return;
  }

  estimatedExpenses = value;

  error.textContent = "";

  updateDashboard();
}

updateButton.addEventListener("click", applyExpenses);

expenseInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    applyExpenses();
  }
});

// Initial dashboard display
updateDashboard();
