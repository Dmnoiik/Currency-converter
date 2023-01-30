"use strict";

const selectionOptionsFrom = document.querySelector("#currency_from");
const selectionOptionsTo = document.querySelector("#currency_to");
const swapBtn = document.querySelector(".currency_swap");
const calculateBtn = document.querySelector(".currency__calculate--btn");
const inputPrice = document.querySelector(".currency_from--input-text");
const spanTo = document.querySelector(".currency_output_to--result");
const spanFrom = document.querySelector(".currency_output_from--base");
const inputResult = document.querySelector(".input__result");
const signFrom = document.querySelector(".currency_output_from--sign");
const signTo = document.querySelector(".currency_output_to--sign");
const currenciesFromApi = [];

///// Set options for select on load of the page
addEventListener("load", function () {
  fetch(
    `https://api.freecurrencyapi.com/v1/currencies?apikey=mVYf3xe5uMYqdf3xfmaer6pMW0ewRdBDvYJQsxIJ`
  )
    .then((response) => response.json())
    .then((data) => {
      const { data: currencies } = data;
      const currencySymbols = Object.values(currencies);
      currencySymbols.forEach((symbol) => {
        currenciesFromApi.push({
          code: symbol.code,
          symbol: symbol.symbol,
          name: symbol.name,
        });
        const html = `
                <option value="${symbol.code}">${symbol.code} - ${symbol.symbol}</option>
                `;

        selectionOptionsFrom.insertAdjacentHTML("beforeend", html);
        selectionOptionsTo.insertAdjacentHTML("beforeend", html);
      });
      const optionPLN = selectionOptionsFrom.querySelector("option[value=PLN]");
      const optionEUR = selectionOptionsTo.querySelector("option[value=EUR]");
      optionPLN.setAttribute("selected", "");
      optionEUR.setAttribute("selected", "");
    });
});

///////////////////// AJAX CALLS

const getResult = function (e) {
  e.preventDefault();
  const spanSymbolFrom = currenciesFromApi.find(
    (obj) => obj.code === selectionOptionsFrom.value
  );
  const spanSymbolTo = currenciesFromApi.find(
    (obj) => obj.code === selectionOptionsTo.value
  );
  signFrom.textContent = spanSymbolFrom.symbol;
  signTo.textContent = spanSymbolTo.symbol;

  fetch(
    `https://api.freecurrencyapi.com/v1/latest?apikey=mVYf3xe5uMYqdf3xfmaer6pMW0ewRdBDvYJQsxIJ&base_currency=${selectionOptionsFrom.value}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!inputPrice.value) return;
      printResult(data);
    });

  document
    .querySelector(".currency_output_container")
    .classList.remove("hidden");
};

const printResult = function (data) {
  const { data: currencyValues } = data;
  //   prettier-ignore
  spanFrom.textContent = +inputPrice.value;
  const result = (
    currencyValues[selectionOptionsTo.value] * +inputPrice.value
  ).toFixed(2);
  spanTo.textContent = result;

  // spanFrom = document.querySelector('.currency_output_from--base') spanTo.textContent = `${inputPrice.value} ${
  //   spanFrom = document.querySelector('.currency_output_from--base').value
  // } = ${(currencyValues[selectionOptionsTo.value] * inputPrice.value).toFixed(
  //   2
  // )} ${selectionOptionsTo.value}`;
};

////////////////// EVENT LISTENERS
calculateBtn.addEventListener("click", getResult);
window.addEventListener("keypress", function (e) {
  if (e.code === "Enter") {
    getResult();
  }
});

///// Change values of two select elements
swapBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const symbolsArr = [selectionOptionsFrom.value, selectionOptionsTo.value];
  selectionOptionsFrom.value = symbolsArr[1];
  selectionOptionsTo.value = symbolsArr[0];
});
