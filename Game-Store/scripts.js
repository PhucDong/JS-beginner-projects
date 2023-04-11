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

// getFeaturedGamesList();

// Render them to browser
const featuredGamesCards = document.querySelector(".featured-deal-cards");

async function renderFeaturedGames() {
    featuredGamesList = await getFeaturedGamesList();
    featuredGamesList.forEach(featuredGame => {
        featuredGamesCards.insertAdjacentHTML("beforeend",`
            <div class="card featured-deal-card">
                <div class="card-content">
                    <div class="card-header featured-deal-header">
                        <img src=${featuredGame.header_image} alt=${featuredGame.name}>
                    </div>

                    <div class="card-body featured-deal-body">
                        <h3>${featuredGame.name}</h3>
                        <div class="price-and-button">
                            <p>${featuredGame.price}</p>
                            <button class="add-to-cart-btn">Add to cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}   

renderFeaturedGames();

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

const aList = document.getElementsByClassName("featured-deal-card");
console.log(aList);

const newList = Array.from(aList);
// console.log(newList);

newList.forEach(function(item) {
    console.log(item);
});