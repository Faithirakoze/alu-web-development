const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

// Loop through both the 'from' and 'to' dropdowns
for(let i = 0; i < dropList.length; i++){
  for(currency_code in country_code){
    //selecting USD by default as FROM currency and JPY as TO currency
    let selected;
    if(i == 0){
      selected = currency_code == "USD" ? "selected" : "";
    }else if(i == 1){
      selected = currency_code == "JPY" ? "selected" : "";
    }
    // Create option tag with currency code as both value and text
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", e =>{
    loadFlag(e.target); //calling LoadFlag with passing target element as an argument
  });

}

function loadFlag(element){
  for(code in country_code){
    if(code == element.value){ //if currency code of country list is equal to option value
      let imgTag = element.parentElement.querySelector("img"); //selecting img tag of particular drop list
      //passing country code of a selected currency code in a img url
      imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`
    }
  }
}

window.addEventListener("load", () =>{
  getExchangeRate();
});

getButton.addEventListener("click", e =>{
  e.preventDefault(); //preventing form from submitting
  getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=>{
  let tempCode = fromCurrency.value; //temporary currency code of FROM drop list
  fromCurrency.value = toCurrency.value; //passing TO currency code to FROM currency code
  toCurrency.value = tempCode; //passing temporary currency code  to TO currency code
  loadFlag(fromCurrency); //calling loadFlag with passing  select element (fromCurrency) of FROM
  loadFlag(toCurrency); //calling loadFlag with passing select element (toCurrency) of TO
  getExchangeRate();
});

function getExchangeRate(){
  const amount = document.querySelector(".amount input"),
  exchangeRateTxt = document.querySelector(".exchange-rate");
  let amountVal = amount.value;
  //if user don't enter any value or enter 0 then we'll put 1 value by default in the input field
  if(amountVal == "" || amountVal == "0"){
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  //fetching api response and returning it ith parsing into js onj and in another then method receiving that obj
  fetch(url).then(response => response.json()).then(result => {
    let exchangeRate = result.conversion_rates[toCurrency.value];
    let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
    exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
  }).catch(() =>{ //if user is offline or any  other error occured while fetching data then catch function will run
    exchangeRateTxt.innerText = "Something went wrong";
  });
}