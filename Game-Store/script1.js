// Toggle the navbar on/off
const hamburgerBars = document.querySelector(".fa-bars");
const navBar = document.querySelector(".header-navbar");

hamburgerBars.addEventListener("click", () => {
    navBar.classList.toggle("header-navbar-appear");
});

// Get a list featured games
let featuredGamesUrl = "https://steam-api-mass.onrender.com/games";
let featuredGamesList;

async function renderFeaturedGames(featuredGamesList) {
    const featuredGamesCards = document.querySelector(".featured-deal-cards");

    featuredGamesList.forEach(featuredGame => {
        featuredGamesCards.insertAdjacentHTML("beforeend",`
            <div class="card featured-deal-card" id=${featuredGame.appid} onclick=displayGameDetails(${featuredGame.appid})>
                <div class="card-content">
                    <div class="card-header featured-deal-header">
                        <img src=${featuredGame.header_image} />
                    </div>
                    <div class="card-body featured-deal-body">
                        <h3>${featuredGame.name}</h3>
                        <div class="price-and-button">
                            <p>$${featuredGame.price}</p>
                        </div>
                    </div>
                </div>
            </div>
            `);
    });
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
            <img src=${gameDetails.background} />
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

async function displayGameDetails(id) {
    let singleGameDetailsUrl = `https://steam-api-mass.onrender.com/single-game/${id}`;
    let gameDetails = await getGameData(singleGameDetailsUrl);
    renderGameDetails(gameDetails);
}

// Game categories
const gameCategoriesContainer = document.querySelector(".game-categories-cards");
const nextButton = document.querySelector(".next-btn");
const previousButton = document.querySelector(".previous-btn");
let currentPage = 1;
const limitedItemsPerPage = 9;
let gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;

async function getGameData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data["data"];
}

// Render the list of game categories
async function renderGameCategoriesList(gameCategoriesList) {
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

const mainContent = document.querySelector(".main-content");

let gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games`;

function displayGamesOfACategory(category) {
    sessionStorage.setItem("Game Category", category);
    sessionStorage.setItem("Category Card Status", "Clicked");
    window.location.href = window.location.origin + "/results.html";
}

const searchBar =  document.querySelector(".search-bar");

searchBar.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
        let encodedSearchBarValue = encodedSearchQuery(searchBar.value.trim());
        let searchBarUrl = `https://steam-api-mass.onrender.com/games?q=${encodedSearchBarValue}&page=${currentPage}&limit=10`;
        sessionStorage.setItem("Search Bar Url", searchBarUrl);
        sessionStorage.setItem("Search Value", encodedSearchBarValue);
        window.location.href = window.location.origin + "/results.html";
    }
});


previousButton.addEventListener("click", async (event) => {
    if (currentPage === 1) {
        event.preventDefault();
    } else {
        currentPage -= 1;
     
        gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
        gameCategoriesContainer.textContent = "";
        renderGameCategoriesList(await getGameData(gameCategoriesUrl));
    }
});

nextButton.addEventListener("click", async (event) => {
    if (currentPage === 4) {
        event.preventDefault();
    } else {
        currentPage += 1;
        gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;

        gameCategoriesContainer.textContent = "";
        renderGameCategoriesList(await getGameData(gameCategoriesUrl));
    }
});

const allGamesNavItems = document.querySelectorAll(".all-games");
allGamesNavItems.forEach(function(navItem) {
    navItem.addEventListener("click", () => {
        sessionStorage.setItem("All Games Url", "https://steam-api-mass.onrender.com/games");
        window.location.href = window.location.origin + "/results.html";
    });
}); 

async function main() {
    // call API list game
    let featuredGamesList = await getGameData(featuredGamesUrl);

    // render list game
    renderFeaturedGames(featuredGamesList);

    // get game categories
    let gameCategoriesList = await getGameData(gameCategoriesUrl);

    // render game categories
    renderGameCategoriesList(gameCategoriesList);
}

main();