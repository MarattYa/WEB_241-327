// js/renderDishes.js
document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();

  loadOrderFromStorage();

  const sections = {
    soup: document.querySelector("#soup-section"),
    main: document.querySelector("#main-section"),
    salad: document.querySelector("#salads_starters-section"),
    drink: document.querySelector("#drink-section"),
    dessert: document.querySelector("#desserts-section")
  };

  function renderCategory(category, filter = null) {
    const container = sections[category].querySelector(".data-dish");
    container.innerHTML = "";

    let list = dishes.filter(d => d.category === category);
    if (filter) list = list.filter(d => d.kind === filter);

    list.forEach(dish => {
      const card = renderDishCard(dish, {
        mode: "add",
        onClick: () => window.addDishToOrder
      });

      container.appendChild(card);
    });
  }

  Object.keys(sections).forEach(category => {
    renderCategory(category);
  });

  restoreSelectedDishes();
  updateCartPanel();

});

function restoreSelectedDishes() {
  const saved = JSON.parse(localStorage.getItem("lunchOrder")) || {};

  Object.values(saved).forEach(keyword => {
    const card = document.querySelector(`.dish[data-dish="${keyword}"]`);
    if (card) card.classList.add("selected");
  });
}

function updateCartPanel() {
  const panel = document.getElementById("cart-panel");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-link");

  let total = 0;
  Object.values(window.order || {}).forEach(dish => {
    total += Number(dish.price);
  });

  totalEl.textContent = `${total} ₽`;

  if (total > 0) {
    panel.style.display = "flex";        // показываем панель
    checkoutBtn.classList.remove("disabled");
  } else {
    panel.style.display = "none";        // скрываем если заказ пустой
    checkoutBtn.classList.add("disabled");
  }
}

// Переход на страницу заказа по клику на кнопку
const checkoutBtn = document.getElementById("checkout-link");
checkoutBtn.addEventListener("click", () => {
  // Проверяем, что кнопка активна
  if (!checkoutBtn.classList.contains("disabled")) {
    window.location.href = "order.html";
  }
});