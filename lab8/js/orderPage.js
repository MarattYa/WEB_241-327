// js/orderPage.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();               // грузим блюда с сервера
  window.loadOrderFromStorage();    // восстанавливаем order из localStorage
  renderOrderPage();
});

function renderOrderPage() {
  const orderDishesContainer = document.querySelector(".order-dishes");
  const orderForm = document.querySelector(".order-form");
  const emptyBlock = document.querySelector(".order-empty");
  const totalEl = document.getElementById("order-total");

  orderDishesContainer.innerHTML = "";

  const orderEntries = Object.entries(window.order);
  let total = 0;

  // ❌ Если ничего не выбрано
  if (orderEntries.length === 0) {
    emptyBlock.style.display = "block";
    orderForm.style.display = "none";
    totalEl.style.display = "none";
    return;
  }

  // ✅ Если есть выбранные блюда
  emptyBlock.style.display = "none";
  orderForm.style.display = "block";

  // Обновляем summary + карточки
  const summaryFields = {
    soup: document.getElementById("order-soup"),
    main: document.getElementById("order-main"),
    salad: document.getElementById("order-salads_starters"),
    drink: document.getElementById("order-drink"),
    dessert: document.getElementById("order-desserts"),
  };

  // Сбрасываем summary
  Object.values(summaryFields).forEach(el => {
    if (el) el.textContent = "Ничего не выбрано";
  });

  orderEntries.forEach(([category, dish]) => {
    total += Number(dish.price);

    // summary
    if (summaryFields[category]) {
      summaryFields[category].textContent = `${dish.name} — ${dish.price} ₽`;
    }

    // карточка блюда
    const card = createOrderDishCard(dish, category);
    orderDishesContainer.appendChild(card);
  });

  // итоговая стоимость
  totalEl.style.display = "block";
  totalEl.textContent = `Итоговая стоимость: ${total} ₽`;
}

function createOrderDishCard(dish, category) {
  const div = document.createElement("div");
  div.className = "dish";

  div.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}">
    <h3>${dish.name}</h3>
    <p class="price">${dish.price} ₽</p>
    <button type="button" class="remove-btn">Удалить</button>
  `;

  div.querySelector("button").addEventListener("click", () => {
    window.removeDishFromOrder(category);
    renderOrderPage();
  });

  return div;
}