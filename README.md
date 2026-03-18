# Currency Converter 

A web application that provides real-time currency conversion using live exchange rate data. This project highlights REST APIs and asynchronous JavaScript.

## Live Demo
[View Live Project](https://currency-converter-53.netlify.app)

## Key Features
* **Real-Time Exchange Rates:** Fetches the latest global data from the ExchangeRate-API using `async/await`.
* **Dynamic Search:** Implemented `<datalist>` for searchable currency dropdowns.
* **Smart UI Logic:** Prevents invalid conversions (same "From" and "To" currency) and includes a bi-directional "Swap" feature.
* **Persistent Settings:** Uses `localStorage` to remember user currency preferences across sessions.
* **Localization:** Leverages the `Intl.DisplayNames` API to display full, professional currency names.

## Tech
* **Language:** Vanilla JavaScript (ES6+)
* **APIs:** Fetch API (REST), Intl API
* **Styling:** CSS3 with Custom Variables & Poppins Google Font
* **Deployment:** Netlify with GitHub CI/CD

---
*Developed by Christian Owen, Computer Science Student at Xiamen University Malaysia.*
