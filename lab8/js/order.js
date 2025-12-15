// js/order.js

window.order = {
  soup: null,
  main: null,
  salad: null,
  drink: null,
  dessert: null
};

// --- localStorage ---
function saveOrderToStorage() {
  localStorage.setItem("order", JSON.stringify(order));
}

function loadOrderFromStorage() {
  const stored = JSON.parse(localStorage.getItem("order")) || {};
  Object.keys(order).forEach(cat => {
    order[cat] = stored[cat] || null;
  });
}

// --- API ---
window.addDishToOrder = function(keyword) {
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  order[dish.category] = dish.keyword;
  saveOrderToStorage();
};

window.removeDishFromOrder = function(category) {
  order[category] = null;
  saveOrderToStorage();
};
