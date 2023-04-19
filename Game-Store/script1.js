// Toggle the navbar on/off
const hamburgerBars = document.querySelector(".fa-bars");
const navBar = document.querySelector(".header-navbar");

hamburgerBars.addEventListener("click", () => {
    navBar.classList.toggle("header-navbar-appear");
});

// Get a list featured games
let featuredGamesUrl = "https://steam-api-mass.onrender.com/games";
let featuredGamesList;

async function getFeaturedGamesList() {
    try {
        const response = await fetch(featuredGamesUrl);
        const data = await response.json();
        return data["data"];
    } catch (error) {
        console.log(error);
    }
};

async function renderFeaturedGames() {
    const featuredGamesCards = document.querySelector(".featured-deal-cards");
    featuredGamesList = await getFeaturedGamesList();
    featuredGamesList.forEach(featuredGame => {
        featuredGamesCards.insertAdjacentHTML("beforeend",`
            <div class="card featured-deal-card" id=${featuredGame.appid} onclick=displayGameDetails(${featuredGame.appid})>
                <div class="card-content">
                    <div class="card-header featured-deal-header">
                        <img src=${featuredGame.header_image} alt=${featuredGame.name}>
                    </div>
                    <div class="card-body featured-deal-body">
                        <h3>${featuredGame.name}</h3>
                        <div class="price-and-button">
                            <p>$${featuredGame.price}</p>
                            <button class="add-to-cart-btn">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
            `);
    });
}   

// const bodyEle = document.querySelector("main");
let singleGameDetailsUrl = "";

async function getGameDetails() {
    const response = await fetch(singleGameDetailsUrl);
    const data = await response.json();
    return data["data"];
}

const mainWrapper = document.querySelector("#main-wrapper");

function renderGameDetails(gameDetails) {
    renderDetailedGameHeader(gameDetails);
    renderDetailedGameGenres(gameDetails);
    renderDetailedGameDevelopers(gameDetails);
    renderDetailedGameTags(gameDetails);
}

function renderDetailedGameHeader(gameDetails) {
    mainWrapper.textContent = "";
    
    mainWrapper.insertAdjacentHTML("beforeend", `
        <section class="hero-section detailed-hero-section">
            <img src=${gameDetails.background}  alt=${gameDetails.name} />
        </section>

        <div class="container detailed-main-content">
            <div class="detailed-game-brief-info">
                <h2>${gameDetails.name}</h2>
                <p class="detailed-game-genres"></p>
                <p>Positive ratings: ${gameDetails.positive_ratings}</p>
                <p>Negative ratings: ${gameDetails.negative_ratings}</p>
                <p class="detailed-game-developers"></p>
                <p>Release date: ${gameDetails.release_date.slice(8, 10)}/${gameDetails.release_date.slice(5, 7)}/${gameDetails.release_date.slice(0, 4)}</p>
            </div>
            <div class="detailed-game-price">
                <h3>Buy ${gameDetails.name}</h3>
                <div>
                    <p>$${gameDetails.price}</p>
                    <button>Add to cart</button>
                </div>
            </div>
            <div class="detailed-game-tags">
                <p>Popular user-defined tags for this product</p>
                
            </div>

            <div class="detailed-game-description">
                <h3>Game Description</h3>
                <p>${gameDetails.description}</p>
            </div>
        </div>
    `);
}

function renderDetailedGameGenres(gameDetails) {
    const gameGenres = document.querySelector(".detailed-game-genres");
    console.log(gameGenres);
    gameGenres.textContent = "Genres:";
    gameDetails.genres.forEach(genre => {
        gameGenres.textContent += ` ${genre},`;
    });

    gameGenres.textContent = gameGenres.textContent.slice(0, gameGenres.textContent.length-1);
}

function renderDetailedGameDevelopers(gameDetails) {
    const gameDevelopers = document.querySelector(".detailed-game-developers");
    gameDevelopers.textContent = "Developers:";
    gameDetails.developer.forEach(developer => {
        gameDevelopers.textContent += ` ${developer},`;
    });

    gameDevelopers.textContent = gameDevelopers.textContent.slice(0, gameDevelopers.textContent.length-1);
}

function renderDetailedGameTags(gameDetails) {
    try {
        console.log("127", gameDetails);
        const gameTags = document.querySelector(".detailed-game-tags");
        console.log("129", gameTags);
        gameDetails.steamspy_tags.forEach(tag => {
            console.log(tag);
            gameTags.insertAdjacentHTML("beforeend", `
                <button>${tag}</button>
            `);
        });
        // return gameTags;
        // ko render function => trả 1 object
    } catch (error) {
        console.log("139", error);
    }
}

// let gameDetailsList = "";
async function displayGameDetails(id) {
    singleGameDetailsUrl = `https://steam-api-mass.onrender.com/single-game/${id}`;
    let gameDetails = await getGameDetails();
    renderGameDetails(gameDetails);
}

// Game categories
const gameCategoriesContainer = document.querySelector(".game-categories-cards");
const nextButton = document.querySelector(".next-btn");
const previousButton = document.querySelector(".previous-btn");
let currentPage = 1;
const limitedItemsPerPage = 9;
let gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;


// Get a list of game categories
async function getGameCategoriesList() {
    const response = await fetch(gameCategoriesUrl);
    const data = await response.json();
    return data["data"];    
}

// Render the list of game categories
async function renderGameCategoriesList() {
    const gameCategoriesList = await getGameCategoriesList();
    let encodedCategory = "";
    
    gameCategoriesList.forEach(category => {
        encodedCategory = encodedSearchQuery(category.name);
    
        gameCategoriesContainer.insertAdjacentHTML("beforeend", `
            <div class="card category-card" onclick=displayGamesOfACategory("${encodedCategory}")>
                <div class="card-content">
                    <h3>${category.name}</h3>
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

previousButton.addEventListener("click", (event) => {
    if (currentPage === 1) {
        event.preventDefault();
    } else {
        currentPage -= 1;
        console.log(`Current page: ${currentPage}`);
     
        if (!previousButton.id) {
            gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
            getGameCategoriesList();
            gameCategoriesContainer.textContent = "";
            renderGameCategoriesList();
        } else {
            gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${previousButton.id.slice(0, previousButton.id.length - 1)}`;
            console.log(gamesOfACategoryUrl);
            renderGamesOfACategory();
            renderGameCategoriesSelection();
            renderSearchResultsCards(gamesOfACategoryUrl);      
        }
    }
});

nextButton.addEventListener("click", (event) => {
    if (currentPage === 4) {
        event.preventDefault();
    } else {
        currentPage += 1;
        console.log(`Current page: ${currentPage}`);

        if (!nextButton.id) {
            gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
            getGameCategoriesList();
            gameCategoriesContainer.textContent = "";
            renderGameCategoriesList();
        } else {
            gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${nextButton.id.slice(0, previousButton.id.length - 1)}`;
            console.log(gamesOfACategoryUrl);
            renderGamesOfACategory();
            renderGameCategoriesSelection();
            renderSearchResultsCards(gamesOfACategoryUrl);      
        }
    }
});

async function renderGameCategoriesSelection() {
    gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=1&limit=29`;
    const gameCategoriesList = await getGameCategoriesList();

    let categoriesSelectionEle = document.querySelector("#categories");
    
    gameCategoriesList.forEach(category => {
        categoriesSelectionEle.insertAdjacentHTML("beforeend", `
            <option value=${encodedSearchQuery(category.name)}>${category.name}</option>
        `);
    });
}

async function getGamesOfACategory(gamesOfACategoryUrl) {
    const response = await fetch(gamesOfACategoryUrl);
    const data = await response.json();
    return data["data"];
}

const mainContent = document.querySelector(".main-content");

function renderGamesOfACategory() {
    mainContent.textContent = "";
        
    mainContent.insertAdjacentHTML("beforeend", `
        <div id="categories-selection">
            <h2>Game Categories</h2>
            <div class="select-and-search">
                <select name="categories" id="categories" onchange=displayGamesOfCategoryAfterSelection()>
                        
                </select>
            </div>
        </div>

        <section id="search-results">
            <h2 class="target-heading">Search Results</h2>
            <div class="bottom-underline"></div>

            <div class="cards search-results-cards">
                        
            </div>
        </section>
    `);
}

async function renderSearchResultsCards(gamesOfACategoryUrl) {
    let gamesOfACategoryList = await getGamesOfACategory(gamesOfACategoryUrl);
    const searchResultsCards = document.querySelector(".search-results-cards");

    gamesOfACategoryList.forEach(game => {
        searchResultsCards.insertAdjacentHTML("beforeend", `
            <div class="card search-result-card">
                <div class="card-content">
                    <div class="card-header featured-deal-header">
                        <img src=${game.header_image} alt=${game.name} >
                    </div>
                    <div class="card-body featured-deal-body">
                        <h3>${game.name}</h3>
                        <div class="price-and-button">
                            <p>$${game.price}</p>
                            <button class="add-to-cart-btn">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

let gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games`;
async function displayGamesOfACategory(category) {
    gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${category}`;

    previousButton.id = `${category}1`;
    nextButton.id = `${category}2`;
    
    renderGamesOfACategory();
    renderGameCategoriesSelection();
    renderSearchResultsCards(gamesOfACategoryUrl);
}

const searchBar =  document.querySelector(".search-bar");

searchBar.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
        let encodedSearchBarValue = encodedSearchQuery(searchBar.value.trim());
        let searchBarUrl = `https://steam-api-mass.onrender.com/games?q=${encodedSearchBarValue}`;
        renderGameCategoriesSelection();
        renderGamesOfACategory();
        renderSearchResultsCards(searchBarUrl);
    }
});


function displayGamesOfCategoryAfterSelection() {
    const gameGenreSelectionEle = document.querySelector("#categories");
    gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?page=${currentPage}&limit=10&genres=${gameGenreSelectionEle.value}`;
    previousButton.id = `${gameGenreSelectionEle.value}1`;
    nextButton.id = `${gameGenreSelectionEle.value}2`;
    renderGameCategoriesSelection();
    renderGamesOfACategory();
    renderSearchResultsCards(gamesOfACategoryUrl);
}

function main() {
    // call API list game
    getFeaturedGamesList();

    // render list game
    renderFeaturedGames();

    // get game categories
    getGameCategoriesList();

    // render game categories
    renderGameCategoriesList();
}

main();