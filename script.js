const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

form.addEventListener('submit', addTransaction);

function addTransaction(e){
    e.preventDefault();
    if (text.value.trim() === "" || amount.value.trim() === ""){
        alert("Please add a text and amount for the transaction.");
        return;
    }

    const newTransaction = {
        id: Date.now(),
        text: text.value,
        amount: +amount.value
    };

    transactions.push(newTransaction);
    addTransactionToDOM(newTransaction);
    updateValues(); 
    updateLocalStorage();
    text.value = "";
    amount.value = "";
}

function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `${transaction.text}
    <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
    const income = amounts.filter(a=> a > 0).reduce((a,b) => a + b.toFixed(2), 0);
    const expense = amounts.filter(a => a < 0).reduce((a, b) => a + b.toFixed(2), 0);

    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${(expense)}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionToDOM);
    updateValues();
}

form.addEventListener("submit", addTransaction);

init();