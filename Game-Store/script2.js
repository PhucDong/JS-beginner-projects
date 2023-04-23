// Toggle the navbar on/off
const hamburgerBars = document.querySelector(".fa-bars");
const navBar = document.querySelector(".header-navbar");

hamburgerBars.addEventListener("click", () => {
    navBar.classList.toggle("header-navbar-appear");
});

let currentPage = 1;
const limitedItemsPerPage = 9;
let gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
let gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games`;

async function getGameData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data["data"];
    } catch(error) {
        console.log(error.message);
    }
}

let categoriesSelectionEle = document.querySelector("#categories");
async function renderGameCategoriesSelection() {
    gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=1&limit=29`;
    let gameCategoriesList = await getGameData(gameCategoriesUrl);

    gameCategoriesList.forEach(category => {
        categoriesSelectionEle.insertAdjacentHTML("beforeend", `
            <option value=${encodedSearchQuery(category.name)}>${category.name}</option>
        `);
    });
}

const nextButton = document.querySelector(".next-btn");
const previousButton = document.querySelector(".previous-btn");
const searchResultsCards = document.querySelector(".search-results-cards");

async function renderGamesOfACategory(gamesOfACategoryUrl) {
    // console.log(41, gamesOfACategoryUrl);
    let gamesOfACategoryList = await getGameData(gamesOfACategoryUrl);
    // console.log(`Number of games in a genre: ${gamesOfACategoryList.length}`);

    gamesOfACategoryList.forEach(game => {
        searchResultsCards.insertAdjacentHTML("beforeend", `
            <div class="card search-result-card">
                <div class="card-content">
                    <div class="card-header featured-deal-header">
                        <img src=${game.header_image} />
                    </div>
                    <div class="card-body featured-deal-body">
                        <h3>${game.name}</h3>
                        <div class="price-and-button">
                            <p>$${game.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function encodedSearchQuery(str) {
    return encodeURI(str)
      .replace(/%5B/g, "[")
      .replace(/%5D/g, "]")
      .replace(
        /[!'()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

function renderGamesOfCategoryAfterSelection() {
    const gameGenreSelectionEle = document.querySelector("#categories");
    gameGenreSelectionEle.addEventListener("change", function() {
        currentPage = 1;
        gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${gameGenreSelectionEle.value}`;
        searchResultsCards.textContent = "";
        renderGamesOfACategory(gamesOfACategoryUrl);
        // console.log(74, gamesOfACategoryUrl);
        previousButton.id = gameGenreSelectionEle.value;
        nextButton.id = gameGenreSelectionEle.value;
    });
}

const gameCategory = sessionStorage.getItem("Game Category");

previousButton.addEventListener("click", (event) => {
    if (currentPage === 1) {
        event.preventDefault();
    } else {
        currentPage -= 1;
        // console.log(94, currentPage);
     
        if(!previousButton.id) {
            gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${gameCategory}`;
            // console.log(98, gamesOfACategoryUrl);
            searchResultsCards.textContent = "";
            renderGamesOfACategory(gamesOfACategoryUrl);
        } else {
            gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${previousButton.id}`;
            // console.log(103, gamesOfACategoryUrl);
            searchResultsCards.textContent = "";
            renderGamesOfACategory(gamesOfACategoryUrl);
        }
    }
});

nextButton.addEventListener("click", (event) => {
    if (currentPage === 4) {
        event.preventDefault();
    } else {
        currentPage += 1;
        // console.log(115, currentPage);
     
        if(!previousButton.id) {
            gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${gameCategory}`;
            // console.log(119, gamesOfACategoryUrl);
            searchResultsCards.textContent = "";
            renderGamesOfACategory(gamesOfACategoryUrl);
        } else {
            gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${nextButton.id}`;
            // console.log(124, gamesOfACategoryUrl);
            searchResultsCards.textContent = "";
            renderGamesOfACategory(gamesOfACategoryUrl);
        } 
    }
});

const searchBar =  document.querySelector(".search-bar");

searchBar.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
        let encodedSearchBarValue = encodedSearchQuery(searchBar.value.trim());
        let searchBarUrl = `https://steam-api-mass.onrender.com/games?q=${encodedSearchBarValue}`;
        searchResultsCards.textContent = "";
        renderGamesOfACategory(searchBarUrl);
    }
});

function renderGamesAfterSearchingInHomePage() {
    const searchBarUrl = sessionStorage.getItem("Search Bar Url");
    renderGamesOfACategory(searchBarUrl);
    sessionStorage.removeItem("Search Bar Url");
    sessionStorage.removeItem("Search Value");
}

async function renderAllGames() {
    let allGamesUrl = sessionStorage.getItem("All Games Url");
    renderGamesOfACategory(allGamesUrl);
    sessionStorage.removeItem("All Games Url");
}

function renderGamesAfterClickingACategoryCard() {
    gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${gameCategory}`;
    // console.log(157, gamesOfACategoryUrl);
    searchResultsCards.textContent = "";
    renderGamesOfACategory(gamesOfACategoryUrl);
    sessionStorage.removeItem("Game Category");
    sessionStorage.removeItem("Category Card Status");
}

const allGamesNavItems = document.querySelectorAll(".all-games");
allGamesNavItems.forEach(function(navItem) {
    navItem.addEventListener("click", () => {
        sessionStorage.setItem("All Games Url", "https://steam-api-mass.onrender.com/games");
        searchResultsCards.textContent = "";
        renderAllGames();
    });
});

function main() {
    renderGameCategoriesSelection();

    // render data of games of a category
    if (sessionStorage.getItem("Category Card Status")) {
        renderGamesAfterClickingACategoryCard();
    }

    // render that data
    renderGamesOfCategoryAfterSelection();

    // render games after searching in the home page
    if (sessionStorage.getItem("Search Value")) {
        renderGamesAfterSearchingInHomePage();
    }

    // render all games
    if (sessionStorage.getItem("All Games Url")) {
        renderAllGames();
    }
}

main();