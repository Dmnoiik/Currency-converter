'use strict';

const selectionOptionsTop = document.querySelector('#currency__to__send');
const selectionOptionsBottom = document.querySelector('#currency__to_get');
const arrowsBtn = document.querySelector('.arrows');
const calculateBtn = document.querySelector('.btn__calculate');
const inputPrice = document.querySelector('#price');
const resultPar = document.querySelector('.input__result--text');
const inputResult = document.querySelector('.input__result');
const currenciesFromApi = [];

///////////////////// AJAX CALLS

const getResult = function () {
  fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=mVYf3xe5uMYqdf3xfmaer6pMW0ewRdBDvYJQsxIJ&base_currency=${selectionOptionsTop.value}`)
    .then(response => response.json())
    .then(data => {
      printResult(data);
    });
};

const printResult = function (data) {
  const { data: currencyValues } = data;
  // prettier-ignore
  resultPar.textContent = `${inputPrice.value} ${selectionOptionsTop.value} = ${(
    currencyValues[selectionOptionsBottom.value] * inputPrice.value
  ).toFixed(2)} ${selectionOptionsBottom.value}`;
  inputResult.style.display = 'block';
};

////////////////// EVENT LISTENERS
calculateBtn.addEventListener('click', getResult);
window.addEventListener('keypress', function (e) {
  if (e.code === 'Enter') {
    getResult();
  }
});

fetch(`https://api.freecurrencyapi.com/v1/currencies?apikey=mVYf3xe5uMYqdf3xfmaer6pMW0ewRdBDvYJQsxIJ`)
  .then(response => response.json())
  .then(data => {
    const { data: currencies } = data;
    const currencySymbols = Object.values(currencies);
    currencySymbols.forEach(symbol => {
      currenciesFromApi.push({ code: symbol.code, symbol: symbol.symbol, name: symbol.name });
      const html = `
        <option value="${symbol.code}">${symbol.code} - ${symbol.symbol}</option>
        `;

      selectionOptionsTop.insertAdjacentHTML('beforeend', html);
      selectionOptionsBottom.insertAdjacentHTML('beforeend', html);
    });
    const optionPLN = selectionOptionsTop.querySelector('option[value=PLN]');
    const optionEUR = selectionOptionsBottom.querySelector('option[value=EUR]');
    optionPLN.setAttribute('selected', '');
    optionEUR.setAttribute('selected', '');
  });

///// Change values of two select elements
arrowsBtn.addEventListener('click', function () {
  const symbolsArr = [selectionOptionsTop.value, selectionOptionsBottom.value];
  selectionOptionsTop.value = symbolsArr[1];
  selectionOptionsBottom.value = symbolsArr[0];
});
