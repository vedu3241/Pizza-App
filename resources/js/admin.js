import axios from "axios";
import moment from "moment";
import noty from "noty";

export function initAdmin(socket) {
  let orders = [];
  let markup;

  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      orders = res.data;
      markup = generateMarkup(orders);
      document.getElementById("orderTableBody").innerHTML = markup;
    })
    .catch((err) => {
      console.log(err);
    });

  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        return `
              <p>${menuItem.item.name} - ${menuItem.Qty} pcs </p>
          `;
      })
      .join("");
  }

  function generateMarkup(orders) {
    // let myOrder = orders.split("");
    // console.log(typeof myOrder);
    return orders
      .map((order) => {
        return `
              <tr>
              <td class="border px-4 py-2 text-green-900">
                  <p>${order._id}</p>
                  <div>${renderItems(order.items)}</div>
              </td>

              <td class="border px-4 py-2">${order.customerId.name}</td>

              <td class="border px-4 py-2">${order.address}</td>

              <td class="border px-4 py-2">
                  <div class="inline-block relative w-64">
                      <form action="/admin/orders/status" method="POST">
                          <input type="hidden" name="orderId" value="${
                            order._id
                          }">
                          <select name="status" onchange="this.form.submit()"
                              class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                              <option value="order_placed"
                              ${
                                order.Status === "order_placed"
                                  ? "selected"
                                  : ""
                              }>
                              Placed
                              </option>

                              <option value="confirmed" 
                              ${order.Status === "confirmed" ? "selected" : ""}>
                                  Confirmed</option>
                              <option value="prepared" ${
                                order.Status === "prepared" ? "selected" : ""
                              }>
                                  Prepared</option>
                              <option value="delivered" ${
                                order.Status === "delivered" ? "selected" : ""
                              }>
                                  Delivered
                              </option>
                              <option value="completed" ${
                                order.Status === "completed" ? "selected" : ""
                              }>
                                  Completed
                              </option>
                          </select>
                      </form>
                      <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20">
                              <path
                                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                      </div>
                  </div>
              </td>

              <td class="border px-4 py-2">
                  ${moment(order.createdAt).format("hh:mm A")}
              </td>

          </tr>
      `;
      })
      .join("");
  }
  socket.on("orderPlaced", (order) => {
    new noty({
      type: "success",
      timeout: 1000,
      text: "New order!!",
    }).show();
    orders.unshift(order);
    document.getElementById("orderTableBody").innerHTML = "";
    document.getElementById("orderTableBody").innerHTML =
      generateMarkup(orders);
  });
}
