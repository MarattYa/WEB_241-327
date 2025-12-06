// js/order.js

let order = {
  soup: null,
  main: null,
  drink: null
};

function updateOrderView() {
   // элементы в DOM
  const soupEl = document.querySelector("#order-soup");
  const mainEl = document.querySelector("#order-main");
  const drinkEl = document.querySelector("#order-drink");
  const totalEl = document.querySelector("#order-total");


  soupEl.textContent  = order.soup  ? order.soup.name  : "Ничего не выбрано";
  mainEl.textContent  = order.main  ? order.main.name  : "Ничего не выбрано";
  drinkEl.textContent = order.drink ? order.drink.name : "Ничего не выбрано";

  const total =
    (order.soup?.price || 0) +
    (order.main?.price || 0) +
    (order.drink?.price || 0);
  
  if (total > 0) {
    totalEl.style.display = "block";
    totalEl.textContent = `Итоговая стоимость: ${total} ₽`;
  } else {
    totalEl.style.display = "none";
  }
}

window.addDishToOrder = function (keyword) {
  const dish = dishes.find(d => d.keyword === keyword);
  if(!dish) return;

  order[dish.category] = dish;

  updateOrderView();
};
