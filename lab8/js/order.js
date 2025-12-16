// js/order.js
window.STORAGE_KEY = window.STORAGE_KEY || "lunchOrder";
window.order = window.order || {};

// Загрузка заказа из localStorage
function loadOrderFromStorage() {
  const saved = JSON.parse(localStorage.getItem(window.STORAGE_KEY)) || {};
  Object.entries(saved).forEach(([category, keyword]) => {
    const dish = dishes.find(d => d.keyword === keyword);
    if (dish) window.order[category] = dish;
  });
}

// Сохранение заказа
function saveOrder() {
  const toSave = {};
  Object.entries(window.order).forEach(([category, dish]) => {
    toSave[category] = dish.keyword;
  });
  localStorage.setItem(window.STORAGE_KEY, JSON.stringify(toSave));
}

// Добавление блюда
window.addDishToOrder = function(keyword) {
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  unselectCategory(dish.category);
  window.order[dish.category] = dish;
  saveOrder();

  // Только если элементы существуют
  if (typeof window.updateCartPanel === "function") window.updateCartPanel();
  if (typeof window.updateOrderView === "function") window.updateOrderView();
};

// Удаление блюда
window.removeDishFromOrder = function(category) {
  delete window.order[category];
  saveOrder();
  if (typeof window.updateCartPanel === "function") window.updateCartPanel();
  if (typeof window.updateOrderView === "function") window.updateOrderView();
};

// Снимаем подсветку с других карточек в категории
function unselectCategory(category) {
  const section = document.querySelector(`#${category}-section`);
  if (!section) return;

  section.querySelectorAll(".dish.selected")
    .forEach(card => card.classList.remove("selected"));
}

// Обновление панели заказа (для lunch.html)
window.updateCartPanel = function() {
  const panel = document.getElementById("cart-panel");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-link");

  if (!panel || !totalEl || !checkoutBtn) return; // проверяем существование

  let total = 0;
  Object.values(window.order || {}).forEach(dish => {
    total += Number(dish.price);
  });

  totalEl.textContent = `${total} ₽`;

  if (total > 0) {
    panel.style.display = "flex";
    checkoutBtn.classList.remove("disabled");
  } else {
    panel.style.display = "none";
    checkoutBtn.classList.add("disabled");
  }
};

// Обновление заказа (для order.html)
window.updateOrderView = function() {
  const fields = {
    soup: document.getElementById("order-soup"),
    main: document.getElementById("order-main"),
    salad: document.getElementById("order-salads_starters"),
    drink: document.getElementById("order-drink"),
    dessert: document.getElementById("order-desserts"),
  };

  const totalEl = document.getElementById("order-total");
  if (!totalEl) return; // проверяем существование

  let total = 0;
  Object.entries(window.order).forEach(([category, dish]) => {
    if (fields[category]) {
      fields[category].textContent = dish.name;
      total += Number(dish.price);
    }
  });

  if (total > 0) {
    totalEl.style.display = "block";
    totalEl.textContent = `Итоговая стоимость: ${total} ₽`;
  } else {
    totalEl.style.display = "none";
  }
};
