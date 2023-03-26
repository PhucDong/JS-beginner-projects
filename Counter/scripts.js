const value = document.querySelector("#value");
const btnDecrease = document.querySelector(".btn-decrease");
const btnIncrease = document.querySelector(".btn-increase");
const btnReset = document.querySelector(".btn-reset");
let count = 0;

function updateTextColor() {
  value.textContent = `${count}`;
  if (count < 0) {
    value.style.color = "red";
  } else if (count > 0) {
    value.style.color = "green";
  } else {
    value.style.color = "black";
  }
}

btnDecrease.addEventListener("click", () => {
  count -= 1;
  updateTextColor();
});

btnIncrease.addEventListener("click", () => {
  count += 1;
  updateTextColor();
});

btnReset.addEventListener("click", () => {
  count = 0;
  updateTextColor();
});
