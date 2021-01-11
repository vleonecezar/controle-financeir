const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage.getItem('transactions') != null ? localStorageTransactions : [] 

const removeTransaction = id => {
	transactions = transactions.filter(transaction => transaction.id != id)
	init()
	updateLocalStorege()
}

const addTransactionIntoDOM = ({ id, name, amount }) => {
  const operator = amount < 0 ? '-' : '+'
  const CSSClass = amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(amount).toFixed(2)
  const li = document.createElement('li')
    
  li.classList.add(CSSClass)
  li.innerHTML = `
  	${name} <span>${operator} R$ ${amountWithoutOperator}</span>
		<button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `
	transactionsUl.prepend(li)
}

const getTotal = transactionsAmount => transactionsAmount
	.reduce((acc, transaction) => acc + transaction, 0)
	.toFixed(2)

const getIncome = transactionsAmount => transactionsAmount
	.filter(transaction => transaction > 0)
	.reduce((acc, transaction) => acc + transaction, 0)
	.toFixed(2)

const getExpense = transactionsAmount => Math.abs(transactionsAmount
	.filter(transaction => transaction < 0)
	.reduce((acc, transaction) => acc + transaction, 0)
	).toFixed(2)

const totalColor = total => {
	if (total < 0) {
		return balanceDisplay.style.color = '#c0392b' 
	}
	balanceDisplay.style.color = '#2e75cc'
}

const updateBalanceValues = () => {
	const transactionsAmount = transactions.map(({ amount }) => amount)
	const total = getTotal(transactionsAmount)
	const income = getIncome(transactionsAmount)
	const expense = getExpense(transactionsAmount)

	balanceDisplay.textContent = `R$ ${total}`
	incomeDisplay.textContent = `R$ ${income}`
	expenseDisplay.textContent = `R$ ${expense}`

	totalColor(total)
}

const init = () => {
	transactionsUl.innerHTML = ''

  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
} 

const updateLocalStorege = () => {
	localStorage.setItem('transactions', JSON.stringify(transactions)) 
}

const generateId = () => Math.round(Math.random() * transactions.length)

const isUniqueId = () => {
	const transactionIds = transactions.map(transaction => transaction.id)
	let uniqueId = generateId()

	while (transactionIds.includes(uniqueId))
		uniqueId = generateId()
	
	return uniqueId
}

const addToTransactionsArray = (transactionName, transactionAmount) => {
	transactions.push({
		id: isUniqueId(), 
		name: transactionName, 
		amount: Number(transactionAmount)
	})
}

const cleanInputs = () => {
	inputTransactionName.value = ''
	inputTransactionAmount.value = ''
	inputTransactionName.focus()
}

const handleFormSubmit = event => {
	event.preventDefault()

	const transactionName = inputTransactionName.value.trim() 
	const transactionAmount = inputTransactionAmount.value.trim() 
	const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

	if (isSomeInputEmpty)	{
		alert('Por favor, preencha o nome e o valor da transação.')
		return
	} 

	addToTransactionsArray(transactionName, transactionAmount)
	init()
	updateLocalStorege()
	cleanInputs()
}

init()

form.addEventListener('submit', handleFormSubmit)