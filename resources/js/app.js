import axios from "axios";
import noty from "noty";
import { initAdmin } from "./admin";
let addToCart = document.querySelectorAll(".add-to-cart"); //took all add btn in an array
let cartCounter = document.querySelector("#cartCounter");

function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        text: "item addded to cart",
      }).show();
    })
    .catch((err) => {
      console.error(err);
    });
}

addToCart.forEach((btn) => {
  //added click event to each btn
  btn.addEventListener("click", () => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

initAdmin();
