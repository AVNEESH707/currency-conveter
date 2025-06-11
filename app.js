const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

const API_KEY = "9895b267cf7d74eb98b64107";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`;

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.textContent = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  element.parentElement.querySelector("img").src = newSrc;
}

async function updateExchangeRate() {
  const amount = parseFloat(amountInput.value) || 1;
  const from = fromCurr.value;
  const to = toCurr.value;

  if (from === to) {
    msg.innerText = `${amount} ${from} = ${amount} ${to}`;
    return;
  }

  const url = `${BASE_URL}/${from}/${to}/${amount}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.result === "success") {
      msg.innerText = `${amount} ${from} = ${data.conversion_result} ${to}`;
    } else {
      msg.innerText = "Failed to fetch exchange rate.";
    }
  } catch (err) {
    msg.innerText = "Network error.";
    console.error(err);
  }
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
