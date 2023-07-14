import axios from "axios";
import noty from "noty";
import { initAdmin } from "./admin";
import moment from "moment";
let addToCart = document.querySelectorAll(".add-to-cart"); //took all add btn in an array
let cartCounter = document.querySelector("#cartCounter");
let table = document.querySelector(".tbody");

function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new noty({
        type: "success",
        timeout: 1000,
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
    // alert("button clicked");
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

//change order status
const statuses = document.querySelectorAll(".status_line");
let hiddenStatus = document.querySelector("#hiddenStatus");
let orderDetails = hiddenStatus ? hiddenStatus.value : null;
orderDetails = JSON.parse(orderDetails);

let time = document.createElement("small");

function updateStatus(order) {
  console.log("in updateStatus method");
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;

  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.Status) {
      stepCompleted = false;
      time.innerHTML = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}
updateStatus(orderDetails);

//socket

let socket = io();

initAdmin(socket);

//join
if (orderDetails) {
  socket.emit("join", `order_${orderDetails._id}`);
}
let adminAreaPath = window.location.pathname;
console.log(adminAreaPath);
if (adminAreaPath.includes("admin")) {
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...orderDetails };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.Status;
  updateStatus(updatedOrder);
  new noty({
    type: "success",
    timeout: 1000,
    text: "Order updated :)",
  }).show();
  console.log("hello");
  console.log(updatedOrder);
});
