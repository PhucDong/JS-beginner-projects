// Toggle the navbar on/off
const hamburgerBars = document.querySelector(".fa-bars");
const navBar = document.querySelector(".header-navbar");

hamburgerBars.addEventListener("click", () => {
    navBar.classList.toggle("header-navbar-appear");
});

// Get a list featured games
// const featuredGamesUrl = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/features";
const featuredGamesUrl = "https://steam-api-mass.onrender.com/games";
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

// Render them to browser
const featuredGamesCards = document.querySelector(".featured-deal-cards");

async function renderFeaturedGames() {
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

const bodyEle = document.querySelector("main");
let singleGameDetailsUrl = "";

async function getGameDetails() {
    console.log("54", singleGameDetailsUrl);
    const response = await fetch(singleGameDetailsUrl);
    console.log("56", response);
    const data = await response.json();
    console.log(data);
    return data["data"];
}

const mainSection = document.querySelector("main");

function renderGameDetails(gameDetails) {
    renderDetailedGameHeader(gameDetails);
    renderDetailedGameGenres(gameDetails);
    renderDetailedGameDevelopers(gameDetails);
    renderDetailedGameTags(gameDetails);
}

function renderDetailedGameHeader(gameDetails) {
    mainSection.textContent = "";
    
    mainSection.insertAdjacentHTML("beforeend", `
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
// let gameCategoriesUrl = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
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
    
    gameCategoriesList.forEach(category => {
        gameCategoriesContainer.insertAdjacentHTML("beforeend", `
            <div class="card category-card">
                <div class="card-content">
                    <h3>${category.name}</h3>
                </div>
            </div>
        `);
    });
}

previousButton.addEventListener("click", (event) => {
    if (currentPage === 1) {
        event.preventDefault();
    } else {
        currentPage -= 1;
        console.log(`Current page: ${currentPage}`);
        gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
        getGameCategoriesList();
        gameCategoriesContainer.textContent = "";
        renderGameCategoriesList();
    }
});

nextButton.addEventListener("click", (event) => {
    if (currentPage === 4) {
        event.preventDefault();
    } else {
        currentPage += 1;
        console.log(`Current page: ${currentPage}`);
        gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
        getGameCategoriesList();
        gameCategoriesContainer.textContent = "";
        renderGameCategoriesList();
    }
});

async function renderCategoriesSelection() {
    gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=1&limit=29`;
    const gameCategoriesList = await getGameCategoriesList();
    const categoriesSelectionEle = document.querySelector("#categories");

    gameCategoriesList.forEach(category => {
        categoriesSelectionEle.insertAdjacentHTML("beforeend", `
            <option value=${category.name}>${category.name}</option>
        `);
    });
}

function main() {
    // call API list game
    getFeaturedGamesList();

    // render list game
    renderFeaturedGames();

    // get game categories
    getGameCategoriesList();

    // render game categories
    // renderGameCategoriesList();

    // render categories selection
    renderCategoriesSelection();
}

main();