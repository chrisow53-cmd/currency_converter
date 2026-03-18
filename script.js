const coverterForm = document.getElementById("converter-form");
const fromCurrencyInput = document.getElementById("from-currency");
const toCurrencyInput = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const swapBtn = document.getElementById("swap-btn");
const fromDataList = document.getElementById("list-from");
const toDataList = document.getElementById("list-to");

let allCurrencies = [];

window.addEventListener("load", () => {
    fetchCurrencies();
    loadPreferences();
});

coverterForm.addEventListener("submit", convertCurrencies);
// Still need these to update the dropdown lists (filtering)
fromCurrencyInput.addEventListener("input", updateLists);
toCurrencyInput.addEventListener("input", updateLists);
swapBtn.addEventListener("click", swapCurrencies);

async function fetchCurrencies() {
    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        const currencyCodes = Object.keys(data.rates);
        const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });

        allCurrencies = currencyCodes.map(code => {
            let fullName = code;
            try { fullName = currencyNames.of(code); } catch (e) {}

            return {
                code: code,
                display: `${code} - ${fullName}` // No flag, just text
            };
        });
        
        updateLists();

    } catch (error) {
        alert("Error loading currency data.");
    }
}

function updateLists() {
    const currentFrom = fromCurrencyInput.value.toUpperCase();
    const currentTo = toCurrencyInput.value.toUpperCase();

    renderOptions(fromDataList, currentTo);
    renderOptions(toDataList, currentFrom);
}

function renderOptions(listElement, excludeCode) {
    listElement.innerHTML = '';
    allCurrencies.forEach(currency => {
        if (currency.code === excludeCode) return;
        const option = document.createElement("option");
        option.value = currency.code;
        option.textContent = currency.display;
        listElement.appendChild(option);
    });
}

function swapCurrencies() {
    const temp = fromCurrencyInput.value;
    fromCurrencyInput.value = toCurrencyInput.value;
    toCurrencyInput.value = temp;
    updateLists();
    if(amountInput.value) {
        coverterForm.dispatchEvent(new Event('submit'));
    }
}

function savePreferences() {
    localStorage.setItem('currencyFrom', fromCurrencyInput.value);
    localStorage.setItem('currencyTo', toCurrencyInput.value);
}

function loadPreferences() {
    const savedFrom = localStorage.getItem('currencyFrom');
    const savedTo = localStorage.getItem('currencyTo');

    if (savedFrom) fromCurrencyInput.value = savedFrom;
    if (savedTo) toCurrencyInput.value = savedTo;
}

async function convertCurrencies(e) {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const fromVal = fromCurrencyInput.value.toUpperCase();
    const toVal = toCurrencyInput.value.toUpperCase();

    if (amount < 0 || isNaN(amount)) {
        alert("Please enter a valid amount");
        return;
    }

    if (!fromVal || !toVal) {
        alert("Please select currencies");
        return;
    }

    savePreferences();

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromVal}`);
        if (!response.ok) throw new Error("Currency not found");
        
        const data = await response.json();
        const rate = data.rates[toVal];

        if (!rate) {
            alert(`Conversion rate for ${toVal} not found.`);
            return;
        }

        const formattedAmount = amount.toLocaleString('en-US');
        const convertedAmount = (amount * rate).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        resultDiv.textContent = `${formattedAmount} ${fromVal} = ${convertedAmount} ${toVal}`;
    } catch (error) {
        alert("Error fetching data. Check currency code.");
    }
}