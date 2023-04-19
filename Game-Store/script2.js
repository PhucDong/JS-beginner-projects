// let currentPage = 1;
// const limitedItemsPerPage = 9;
// let gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=${currentPage}&limit=${limitedItemsPerPage}`;

// async function getGameCategoriesList() {
//     const response = await fetch(gameCategoriesUrl);
//     const data = await response.json();
//     return data["data"];    
// }

// async function renderCategoriesSelection() {
//     gameCategoriesUrl = `https://steam-api-mass.onrender.com/genres?page=1&limit=29`;
//     const gameCategoriesList = await getGameCategoriesList();
//     const categoriesSelectionEle = document.querySelector("#categories");

//     gameCategoriesList.forEach(category => {
//         categoriesSelectionEle.insertAdjacentHTML("beforeend", `
//             <option value=${category.name}>${category.name}</option>
//         `);
//     });
// }

// async function getGamesOfACategory(gamesOfACategoryUrl) {
//     const response = await fetch(gamesOfACategoryUrl);
//     const data = await response.json();
//     return data["data"];
// }

// function renderGamesOfACategory(gamesOfACategoryList) {
//     // mainSection.textContent = "";
//     gamesOfACategoryList.forEach(game => {
//         featuredGamesCards.insertAdjacentHTML("beforeend", `
//             <div class="card featured-deal-card">
//                 <div class="card-content">
//                     <div class="card-header featured-deal-header">
//                         <img src=${game.header_image} alt=${game.name} >
//                     </div>
//                     <div class="card-body featured-deal-body">
//                         <h3>${game.name}</h3>
//                         <div class="price-and-button">
//                             <p>$${game.price}</p>
//                             <button class="add-to-cart-btn">Add to cart</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `);
//     });
// }

// async function displayGamesOfACategory(category) {
//     let gamesOfACategoryUrl = `https://steam-api-mass.onrender.com/games?genres=${category}`;
//     let gamesOfACategoryList = await getGamesOfACategory(gamesOfACategoryUrl);
//     window.location.href += "detailedInfoPage.html";
//     renderCategoriesSelection();
//     renderGamesOfACategory(gamesOfACategoryList);
// }

function main() {
    getGameCategoriesList();
    renderCategoriesSelection();
}

main();