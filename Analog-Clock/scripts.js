const hourHand = document.querySelector("#hour-hand");
const minuteHand = document.querySelector("#minute-hand");
const secondHand = document.querySelector("#second-hand");

function setRotation(hand, rotation) {
  hand.style.setProperty("--rotation", rotation);
}

function setClock() {
  const currentDate = new Date();
  const second = currentDate.getSeconds() / 60;
  const minute = (second + currentDate.getMinutes()) / 60;
  const hour = (minute + currentDate.getHours()) / 12;
  
  setRotation(hourHand, hour * 360);
  setRotation(minuteHand, minute * 360);
  setRotation(secondHand, second * 360);
}

setInterval(setClock, 1000);