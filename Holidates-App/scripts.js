const API_KEY = "6bf942ac-f58f-43f3-8abc-43bde5925b64";

const countriesUrl = `https://holidayapi.com/v1/countries?pretty&key=${API_KEY}`;
const languagesUrl = `https://holidayapi.com/v1/languages?pretty&key=${API_KEY}`;
let holidaysUrl = `https://holidayapi.com/v1/holidays?pretty&key=${API_KEY}`;

let countriesList;
let languagesList;
const showCountriesListBtn = document.getElementById("countries-list-btn");

const countriesListUl = document.querySelector("#countries-list");

showCountriesListBtn.addEventListener("click", async function () {
  countriesList = await getCountriesList();
  renderCountriesList();
  assignCountryCodesToDropdownList();
});

async function getCountriesList() {
  const response = await fetch(countriesUrl);
  const data = await response.json();
  return data.countries;
}

function renderCountriesList() {
  countriesList.forEach((country, index) => {
    countriesListUl.insertAdjacentHTML(
      "beforeend",
      `
      <li>
        <div class="bullet">${index + 1}</div>
        <div class="li-wrapper">
          <div class="li-title">${country.name}</div>
          <div class="li-text">Code: ${country.code}</div>
        </div>
      </li>
    `
    );
  });
}

const selectCountryCodeEle = document.getElementById("country-query");
function assignCountryCodesToDropdownList() {
  countriesList.forEach((country) => {
    selectCountryCodeEle.add(new Option(`${country.code}`));
  });
}

const showLanguagesBtn = document.querySelector("#languages-list-btn");
showLanguagesBtn.addEventListener("click", async function () {
  languagesList = await getLanguagesList();
  renderLanguagesList();
  assignLanguageCodesToDropdownList();
});

const selectLanguageCodeEle = document.getElementById("language-query");
function assignLanguageCodesToDropdownList() {
  languagesList.forEach((language) => {
    selectLanguageCodeEle.add(new Option(`${language.code}`));
  });
}

async function getLanguagesList() {
  const response = await fetch(languagesUrl);
  const data = await response.json();
  return data.languages;
}

const languagesListUl = document.querySelector("#languages-list");
function renderLanguagesList() {
  languagesList.forEach((language, index) => {
    languagesListUl.insertAdjacentHTML(
      "beforeend",
      `
      <li>
        <div class="bullet">${index + 1}</div>
        <div class="li-wrapper">
          <div class="li-title">${language.name}</div>
          <div class="li-text">Code: ${language.code}</div>
        </div>
      </li>
    `
    );
  });
}

const showHolidaysBtn = document.getElementById("holidays-btn");
const searchInput = document.getElementById("search-query");
const yearInput = document.getElementById("year-query");
const monthInput = document.getElementById("month-query");
const dayInput = document.getElementById("day-query");
const languageInput = document.getElementById("language-query");
let queriedHolidaysUrl;
let holidaysList;

function checkHolidaysQueries(countryCode) {
  let newHolidaysUrl = "";

  if (!selectCountryCodeEle.value) {
    newHolidaysUrl += `${holidaysUrl}&country=VN&year=2022`;
  } else {
    newHolidaysUrl += `${holidaysUrl}&country=${countryCode}&year=2022`;
  }
  if (yearInput.value) {
    newHolidaysUrl += `${holidaysUrl}&country=${selectCountryCodeEle.value}&year=${yearInput.value}`;
  }
  if (monthInput.value) {
    newHolidaysUrl += `&month=${monthInput.value}`;
  }
  if (dayInput.value) {
    newHolidaysUrl += `&day=${dayInput.value}`;
  }
  if (languageInput.value) {
    newHolidaysUrl += `&language=${selectLanguageCodeEle.value}`;
  }
  if (searchInput.value) {
    newHolidaysUrl += `&search=${encodedSearchQuery(searchInput.value)}`;
  }
  return newHolidaysUrl;
}

async function getHolidaysList() {
  const response = await fetch(queriedHolidaysUrl);
  const data = await response.json();
  return data.holidays;
}

const holidaysListUl = document.querySelector("#holidays-list");
const holidaysTitle = document.querySelector("#holidays-title");
const holidaysYear = document.querySelector("#holidays-year");

function renderHolidaysList() {
  countriesList.forEach((country) => {
    if (selectCountryCodeEle.value === country.code) {
      holidaysTitle.textContent = `Holidays of ${country.name}`;
    } else if (selectCountryCodeEle.value === "") {
      holidaysTitle.textContent = `Holidays of Vietnam`;
    }
  });

  if (yearInput.value) {
    holidaysYear.textContent = `${yearInput.value}`;
  }

  holidaysYear.textContent = `${2022}`;

  holidaysList.forEach((holiday, index) => {
    holidaysListUl.insertAdjacentHTML(
      "beforeend",
      `
      <li>
        <div class="bullet">${index + 1}</div>
        <div class="li-wrapper">
          <div class="li-title">${holiday.name}</div>
          <div class="li-text">Date: ${holiday.date}</div>
        </div>
      </li>
    `
    );
  });
}

// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
function encodedSearchQuery(str) {
  return encodeURI(str)
    .replace(/%5B/g, "[")
    .replace(/%5D/g, "]")
    .replace(
      /[!'()*]/g,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

showHolidaysBtn.addEventListener("click", async function () {
  holidaysListUl.textContent = "";
  countriesList = await getCountriesList();
  countriesList.forEach(async (country) => {
    queriedHolidaysUrl = checkHolidaysQueries(country.code);
    holidaysList = await getHolidaysList();

    if (holidaysList) {
      renderHolidaysList();
    }
  });
});
