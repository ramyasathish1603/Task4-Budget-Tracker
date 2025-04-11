// Select elements
const entryForm = document.getElementById("entry-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const resetButton = document.getElementById("reset");
const entryList = document.getElementById("entry-list");
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const netBalance = document.getElementById("net-balance");
const filterRadios = document.querySelectorAll("input[name='filter']");

let entries = JSON.parse(localStorage.getItem("budgetEntries")) || [];
let editingId = null;

function updateLocalStorage() {
  localStorage.setItem("budgetEntries", JSON.stringify(entries));
}

function renderEntries() {
  const filter = document.querySelector("input[name='filter']:checked").value;
  entryList.innerHTML = "";
  let incomeTotal = 0, expenseTotal = 0;

  entries.forEach((entry, index) => {
    if (filter !== "all" && entry.type !== filter) return;

    const li = document.createElement("li");
    li.className = `entry ${entry.type}`;
    li.innerHTML = `
      <span>${entry.description} - ₹${entry.amount}</span>
      <span>
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </span>
    `;
    entryList.appendChild(li);

    if (entry.type === "income") incomeTotal += +entry.amount;
    else expenseTotal += +entry.amount;
  });

  totalIncome.textContent = `₹${incomeTotal}`;
  totalExpenses.textContent = `₹${expenseTotal}`;
  netBalance.textContent = `₹${incomeTotal - expenseTotal}`;
}

function addEntry(e) {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (!description || isNaN(amount)) return;

  const entry = { description, amount, type };

  if (editingId !== null) {
    entries[editingId] = entry;
    editingId = null;
  } else {
    entries.push(entry);
  }

  updateLocalStorage();
  renderEntries();
  entryForm.reset();
}

function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeSelect.value = entry.type;
  editingId = index;
}

function deleteEntry(index) {
  entries.splice(index, 1);
  updateLocalStorage();
  renderEntries();
}

resetButton.addEventListener("click", () => {
  entryForm.reset();
  editingId = null;
});

entryForm.addEventListener("submit", addEntry);
filterRadios.forEach(radio => radio.addEventListener("change", renderEntries));

renderEntries();