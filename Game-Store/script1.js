// Toggle the navbar on/off
const hamburgerBars = document.querySelector(".fa-bars");
const navBar = document.querySelector(".header-navbar");

hamburgerBars.addEventListener("click", () => {
    navBar.classList.toggle("header-navbar-appear");
});

// Get a list featured games
const featuredGamesUrl = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/features";
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

renderFeaturedGames();

const bodyEle = document.querySelector("main");
let singleGameDetailsUrl = "";

async function getGameDetailsList() {
    const response = await fetch(singleGameDetailsUrl);
    const data = await response.json();
    // console.log(data);
    return data["data"];
}

const mainSection = document.querySelector("main");

async function renderGameDetailsList() {
    const gameDetailsList = await getGameDetailsList();
    mainSection.textContent = "";
    
    mainSection.insertAdjacentHTML("beforeend", `
        <section class="hero-section detailed-hero-section">
        </section>

        <div class="container detailed-main-content">
            <div class="detailed-game-brief-info">
                <h2>${gameDetailsList.name}</h2>
                <p class="detailed-game-genres">${renderDetailedGameGenres()}</p>
                <p>Positive ratings: ${gameDetailsList.positive_ratings}</p>
                <p>Negative ratings: ${gameDetailsList.negative_ratings}</p>
                <p class="detailed-game-developers">${renderDetailedDevelopers()}</p>
                <p>Release date: ${gameDetailsList.release_date.slice(8, 10)}/${gameDetailsList.release_date.slice(5, 7)}/${gameDetailsList.release_date.slice(0, 4)}</p>
            </div>
            <div class="detailed-game-price">
                <h3>Buy ${gameDetailsList.name}</h3>
                <div>
                    <p>$${gameDetailsList.price}</p>
                    <button>Add to cart</button>
                </div>
            </div>
            <div class="detailed-game-tags">
                <p>Popular user-defined tags for this product</p>
                ${renderDetailedGameTags()}
            </div>

            <div class="detailed-game-description">
                <h3>Game Description</h3>
                <p>${gameDetailsList.description}</p>
            </div>
        </div>
    `);
    // });
}

async function renderDetailedGameGenres() {
    const gameDetailsList = await getGameDetailsList();
    const gameGenres = document.querySelector(".detailed-game-genres");
    gameGenres.textContent = "Genres:";
    gameDetailsList.genres.forEach(genre => {
        gameGenres.textContent += ` ${genre},`;
    });

    gameGenres.textContent = gameGenres.textContent.slice(0, gameGenres.textContent.length-1);
}

async function renderDetailedDevelopers() {
    const gameDetailsList = await getGameDetailsList();
    const gameDevelopers = document.querySelector(".detailed-game-developers");
    gameDevelopers.textContent = "Developers:";
    gameDetailsList.developer.forEach(developer => {
        gameDevelopers.textContent += ` ${developer},`;
    });

    gameDevelopers.textContent = gameDevelopers.textContent.slice(0, gameDevelopers.textContent.length-1);
}

async function renderDetailedGameTags() {
    try {
        const gameDetailsList = await getGameDetailsList();
        const gameTags = document.querySelector(".detailed-game-tags");
        gameDetailsList.steamspy_tags.forEach(tag => {
            gameTags.insertAdjacentHTML("beforeend", `
                <button>${tag}</button>
            `);
        });
    } catch (error) {
        console.group(error);
    }
}

// let gameDetailsList = "";
function displayGameDetails(id) {
    singleGameDetailsUrl = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/single-game/${id}`;
    renderGameDetailsList();
}

// Game categories
const gameCategoriesContainer = document.querySelector(".game-categories-cards");
const nextButton = document.querySelector(".next-btn");
const previousButton = document.querySelector(".previous-btn");
let currentPage = 1;
const limitedItemsPerPage = 9;
let gameCategoriesUrl = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;

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

renderGameCategoriesList();

previousButton.addEventListener("click", (event) => {
    if (currentPage === 1) {
        event.preventDefault();
    } else {
        currentPage -= 1;
        console.log(`Current page: ${currentPage}`);
        gameCategoriesUrl = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
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
        gameCategoriesUrl = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;
        getGameCategoriesList();
        gameCategoriesContainer.textContent = "";
        renderGameCategoriesList();
    }
});

const detailedPage = document.querySelector(".detailed-hero-section");
// detailedPage.style.backgroundImage = "url('https://steamcdn-a.akamaihd.net/steam/apps/20/page_bg_generated_v6b.jpg?t=1528732825')";

// const aList = document.getElementsByClassName("featured-deal-card");
// console.log(aList);

// const newList = Array.from(aList);
// console.log(newList.length);

