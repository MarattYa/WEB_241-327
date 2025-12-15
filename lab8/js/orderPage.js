// js/orderPage.js
document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();
  loadOrderFromStorage();

  renderOrder();
  bindRemoveButtons();
});

function renderOrder() {
  const map = {
    soup: "#order-soup",
    main: "#order-main",
    salad: "#order-salads_starters",
    drink: "#order-drink",
    dessert: "#order-desserts"
  };

  let total = 0;

  Object.entries(map).forEach(([category, selector]) => {
    const el = document.querySelector(selector);
    if (!el) return;

    const keyword = order[category];
    if (!keyword) {
      el.textContent = "Ничего не выбрано";
      return;
    }

    const dish = dishes.find(d => d.keyword === keyword);
    if (!dish) return;

    el.textContent = `${dish.name} ${dish.price}₽`;
    total += dish.price;
  });

  const totalEl = document.querySelector("#order-total");
  if (totalEl) {
    totalEl.textContent = `Стоимость заказа: ${total} ₽`;
    totalEl.style.display = total ? "block" : "none";
  }
}

function bindRemoveButtons() {
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      removeDishFromOrder(category);
      renderOrder();
    });
  });
}
