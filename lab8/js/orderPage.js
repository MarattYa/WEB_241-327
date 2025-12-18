// js/orderPage.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();               // грузим блюда с сервера
  window.loadOrderFromStorage();    // восстанавливаем order из localStorage
  renderOrderPage();

  const submitBtn = document.getElementById("submit-order");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitOrder);
  }
});

async function submitOrder() {
  const orderEntries = Object.entries(window.order);
  if (orderEntries.length === 0) {
    alert("Вы не выбрали ни одного блюда. Сначала соберите ланч!");
    return;
  }

  if(typeof window.checkLunch === "function"){
    const ok = window.checkLunch();
    if(!ok) return;
  }

  // Получаем данные из формы
  const full_name = document.getElementById("full_name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const delivery_address = document.getElementById("delivery_address")?.value.trim();
  const delivery_type = document.querySelector('input[name="delivery_type"]:checked')?.value;
  const delivery_time = document.getElementById("delivery_time")?.value;
  const subscribe = document.getElementById("subscribe")?.checked ? 1 : 0;
  const comment = document.getElementById("comment")?.value.trim();

  if (!full_name || !email || !phone || !delivery_address || !delivery_type) {
    alert("Пожалуйста, заполните все обязательные поля!");
    return;
  }

  // Формируем объект для отправки
  const payload = {
    full_name,
    email,
    phone,
    delivery_address,
    delivery_type,
    delivery_time: delivery_type === "by_time" ? delivery_time : null,
    subscribe,
    comment,
    soup_id: window.order.soup?.id || null,
    main_course_id: window.order.main?.id || null,
    salad_id: window.order.salad?.id || null,
    drink_id: window.order.drink?.id || null,
    dessert_id: window.order.dessert?.id || null,
  };

  try {
    const apiKey = "fa539060-cd45-4c8b-bfcd-db8592ca8e11"; 
    const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Ошибка при оформлении заказа");
    }

    alert("Заказ успешно оформлен!");
    // Очистка localStorage и текущего заказа
    localStorage.removeItem(window.STORAGE_KEY);
    window.order = {};
    renderOrderPage();

  } catch (err) {
    alert("Не удалось оформить заказ: " + err.message);
  }
}

function renderOrderPage() {
  const orderSection = document.querySelector(".order-section");
  const orderDishesContainer = document.querySelector(".order-dishes");
  const orderForm = document.querySelector(".order-form");
  const emptyBlock = document.querySelector(".order-empty");
  const totalEl = document.getElementById("order-total");

  orderDishesContainer.innerHTML = "";

  const orderEntries = Object.entries(window.order);
  let total = 0;

  if (orderEntries.length === 0) {
    orderSection.style.display = "none";
    emptyBlock.style.display = "block";
    return;
  }

  emptyBlock.style.display = "none";
  orderSection.style.display = "block";

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