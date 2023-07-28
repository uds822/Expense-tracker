// Initialize the expense manager state object to store earnings, expenses, net amount, and transactions.
const expenseManagerState = {
  earnings: 0,
  expenses: 0,
  net: 0,
  transactions: [],
};

// Initialize variables for handling updates and tracking the transaction ID.
let isTransactionUpdate = false;
let transactionIdToUpdate;

// Get the expense form element from the DOM.
const expenseFormEl = document.getElementById("expenseForm");

// Function to render the transactions in the UI.
const renderTransactions = () => {
  // Get necessary DOM elements for updating transaction details and net amounts.
  const transactionContainerEl = document.querySelector(".transactions");
  const netAmountEl = document.getElementById("netAmount");
  const earningEl = document.getElementById("earning");
  const expenseEl = document.getElementById("expense");

  // Get the selected sorting option.
  const sortOptionEl = document.getElementById("sortOption");
  const selectedSortOption = sortOptionEl.value;

  // Get the list of transactions from the state.
  const transactions = expenseManagerState.transactions;

  // Sort the transactions based on the selected option.
  let sortedTransactions = [...transactions];
  switch (selectedSortOption) {
    case "date":
      sortedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "amount":
      sortedTransactions.sort((a, b) => a.amount - b.amount);
      break;
    case "type":
      sortedTransactions.sort((a, b) => {
        if (a.type === "credit" && b.type === "debit") return -1;
        if (a.type === "debit" && b.type === "credit") return 1;
        return 0;
      });
      break;
    default:
      break;
  }

  // Initialize variables to calculate total earnings, expenses, and net amount.
  let earning = 0;
  let expenses = 0;
  let net = 0;

  // Clear the transaction container before rendering transactions.
  transactionContainerEl.innerHTML = "";


  // Loop through each transaction and create corresponding HTML elements to display in the UI.
  sortedTransactions.forEach((transaction) => {
    const { id, amount, text, type } = transaction;

    // Check if the transaction is a credit (earning) or debit (expense).
    const isCredit = type === "credit" ? true : false;

    // Determine the sign to display before the amount (positive for earning, negative for expense).
    const sign = isCredit ? "+" : "-";

    // Create the HTML for a single transaction element.
    const transactionEl = `
     <div class="transaction" id="${id}">
        <div class="content" onclick="toggleTransactionOptions(${id})">
            <div class="left" >
                <p>${text}</p>
                <p>${sign} ₹ ${amount}</p>
            </div>
            <div class="status ${isCredit ? "credit" : "debit"}">${
      isCredit ? "C" : "D"
    }</div>
        </div>
        <div class="lower">
            <div class="icon" onclick="updateTransaction(${id})">
                <img src="./images/pen-solid.svg" alt="pen" />
            </div>
            <div class="icon" onclick="deleteTransaction(${id})">
                <img src="./images/trash.svg" alt="trash" />
            </div>
        </div>
     </div>`;

    // Update the total earning, expense, and net amounts.
    earning += isCredit ? amount : 0;
    expenses += !isCredit ? amount : 0;
    net = earning - expenses;

    // Insert the transaction element into the transaction container.
    transactionContainerEl.insertAdjacentHTML("afterbegin", transactionEl);
  });

  // Display the updated net, earnings, and expenses in the UI.
  netAmountEl.innerHTML = `₹ ${net}`;
  earningEl.innerHTML = `₹ ${earning}`;
  expenseEl.innerHTML = `₹ ${expenses}`;

  // For debugging, log the current state of net, earnings, and expenses.
  console.log({ net, earning, expenses });
};

// Function to add a new transaction or update an existing transaction.
const addTransaction = (e) => {
  e.preventDefault();

  // Check if the transaction is an earning or expense based on the button clicked.
  const isEarning = e.submitter.id === "addEarnBtn" ? true : false;

  // Get the form data from the expense form.
  const formData = new FormData(expenseFormEl);
  const transactionData = {};

  // Convert the form data into an object.
  formData.forEach((value, key) => {
    transactionData[key] = value;
  });

  // Extract the transaction details from the form data.
  const { transactionText, transactionAmount } = transactionData;

  // Create a new transaction object with the extracted details.
  const transaction = {
    id: isTransactionUpdate ? transactionIdToUpdate : Math.floor(Math.random() * 1000),
    text: transactionText,
    amount: +transactionAmount,
    type: isEarning ? "credit" : "debit",
  };

  // If an update is being performed, update the existing transaction in the state.
// ... (continued from the previous code)

// If an update is being performed, update the existing transaction in the state.
if (isTransactionUpdate) {
  const transactionIndexToUpdate = expenseManagerState.transactions.findIndex((t) => t.id === transactionIdToUpdate);

  expenseManagerState.transactions[transactionIndexToUpdate] = transaction;
  isTransactionUpdate = false;
  transactionIdToUpdate = null;
} else {
  // If it's a new transaction, add it to the transactions array in the state.
  expenseManagerState.transactions.push(transaction);
}

// Render the updated transactions in the UI.
renderTransactions();

// Reset the transaction form after adding/updating the transaction.
expenseFormEl.reset();

// For debugging, log the current state.
console.log({ expenseManagerState });
};

// Function to toggle the visibility of the edit/delete icons for a transaction.
const toggleTransactionOptions = (id) => {
console.log("id", id);

// Get the selected transaction element and its lower section containing icons.
const selectedTransaction = document.getElementById(id);
const lowerEl = selectedTransaction.querySelector(".lower");

// Toggle the class 'showTransaction' to display or hide the edit/delete icons.
lowerEl.classList.toggle("showTransaction");
};

// Function to handle updating a transaction's details.
const updateTransaction = (id) => {
// Find the transaction in the state based on the provided ID.
const transactionToUpdate = expenseManagerState.transactions.find((t) => t.id === id);

// Extract the text and amount from the transaction object.
const { text, amount } = transactionToUpdate;

// Get the text and amount input fields from the form.
const textInput = document.getElementById("transactionText");
const amountInput = document.getElementById("transactionAmount");

// Set the input field values to the current transaction's details.
textInput.value = text;
amountInput.value = amount;

// Save the transaction ID for tracking the update action.
transactionIdToUpdate = id;
isTransactionUpdate = true;
};

// Function to handle deleting a transaction.
const deleteTransaction = (id) => {
// Filter out the transaction with the provided ID from the transactions array in the state.
const filteredTransactions = expenseManagerState.transactions.filter((t) => t.id !== id);

// Update the transactions array in the state with the filtered transactions.
expenseManagerState.transactions = filteredTransactions;

// Render the updated transactions in the UI.
renderTransactions();
};

// Render the initial transactions when the page loads.
renderTransactions();

// Add an event listener to the expense form to handle adding/updating transactions.
expenseFormEl.addEventListener("submit", addTransaction);

