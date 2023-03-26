const decreaseBtn = document.querySelector(".decrease-btn");
const increaseBtn = document.querySelector(".increase-btn");
const resetBtn = document.querySelector(".reset-btn");
const counterValue = document.querySelector("#counter-number");

let counter = 0;
decreaseBtn.addEventListener("click", () => {
  counter -= 1;
  updateText();
});

increaseBtn.addEventListener("click", () => {
  counter += 1;
  updateText();
});

resetBtn.addEventListener("click", () => {
  counter = 0;
  updateText();
});

function updateText() {
  counterValue.textContent = `${counter}`;
  if (counter < 0) {
    counterValue.style.color = "#d74742";
  } else if (counter > 0) {
    counterValue.style.color = "#3ccf63";
  } else {
    counterValue.style.color = "#000000";
  }
}
