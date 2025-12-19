// js/orderPage.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();               // грузим блюда с сервера
  window.loadOrderFromStorage();    // восстанавливаем order из localStorage
  renderOrderPage();

  const orderForm = document.querySelector(".order-form");
  if(orderForm){
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = validateFormFields();
      if (ok) await submitOrder();
    });
  }
});
//подстветка при вводе/выборе
document.querySelectorAll("#name, #email, #phone, #address").forEach(input => {
  input.addEventListener("input", () =>{
    input.classList.remove("input-error");
    const msg = input.nextElementSibling;
    if(msg && msg.classList.contains("error-message")) msg.remove();
  });  
  input.addEventListener("blur", () => validateField(input)); 
});

document.querySelectorAll('input[name="delivery_mode"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const container = document.getElementById("delivery_type_container");
    container.classList.remove("input-error");
    const msg = container.querySelector(".error-message");
    if(msg) msg.remove();
  });
});

async function submitOrder() {

  //Проверка состава заказа
  if(typeof window.checkLunch === "function") {
    const ok = window.checkLunch();
    if(!ok) return;
  }

  if(!validateFormFields()) return;

    // Получаем данные из формы
  const full_name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const delivery_address = document.getElementById("address")?.value.trim();
  const delivery_type = document.querySelector('input[name="delivery_mode"]:checked')?.value;
  const delivery_time = document.getElementById("delivery_time")?.value;
  const subscribe = document.getElementById("subscribe")?.checked ? 1 : 0;
  const comment = document.getElementById("comment")?.value.trim();

    // Формируем объект для отправки
    const payload = {
    full_name,
    email,
    phone,
    delivery_address,
    delivery_type,
    subscribe,
    comment: comment || null,
  };

  // Доп проверка времени
  if(delivery_type === "by_time"){
    if(!delivery_time) {
      alert("Пожалуйста, укажите время доставки");
      return;
    }

    const now = new Date();
    const [hours, minutes] = delivery_time.split(":").map(Number);
    const deliveryDate = new Date();
    deliveryDate.setHours(hours, minutes, 0, 0);

    if (deliveryDate < now) {
      alert("Время доставки не может быть раньше текущего времени");
      return;
    }
    payload.delivery_time = delivery_time;
  }

  if (delivery_type === "at_time") {
    payload.delivery_time = delivery_time;
  }


  // добавляем ТОЛЬКО выбранные блюда
  if (window.order.soup) payload.soup_id = window.order.soup.id;
  if (window.order.main) payload.main_course_id = window.order.main.id;
  if (window.order.salad) payload.salad_id = window.order.salad.id;
  if (window.order.drink) payload.drink_id = window.order.drink.id;
  if (window.order.dessert) payload.dessert_id = window.order.dessert.id;

  try {
    const apiKey = "fa539060-cd45-4c8b-bfcd-db8592ca8e11"; 
    const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
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

function validateField(input) {
  let valid = true;
  let message = "";

  if (!input.value.trim()) {
    valid = false;
    message = "Это поле обязательно";
  } 
  else if (input.id === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
    valid = false;
    message = "Введите корректный email";
  } 
  else if (
    input.id === "phone" &&
    !/^\+7\d{10}$/.test(input.value)
  ) {
    valid = false;
    message = "Введите корректный телефон";
  }

  if (!valid) {
    input.classList.add("input-error");
    showErrorMessage(input, message);
  } else {
    input.classList.remove("input-error");
    const msg = input.parentNode.querySelector(".error-message");
    if (msg) msg.remove();
  }

  return valid;
}

function showErrorMessage(input,message){
  const parent = input.parentNode;
  let msg = input.nextElementSibling;
  if (!msg){
    msg = document.createElement("div");
    msg.className = "error-message";
    parent.appendChild(msg);
  }
  msg.textContent = message;
}


function validateFormFields() {

  const fields = [
    document.getElementById("name"),
    document.getElementById("email"),
    document.getElementById("phone"),
    document.getElementById("address"),
  ];

  for(const field of fields) {
    if(!validateField(field)) {
      field.focus();
      return false
    }
  }

  // Проверка радио delivery_mode
  const deliveryTypeEl = document.querySelector('input[name="delivery_mode"]:checked');
  const container = document.getElementById("delivery_type_container");

  if(!deliveryTypeEl) {
    container.classList.add("input-error");

    if(!container.querySelector(".error-message")) {
      const msg = document.createElement("div");
      msg.className = "error-message";
      msg.textContent = "Выберите тип доставки";
      container.appendChild(msg);
    }
    return false;
  }
  container.classList.remove("input-error");
  const msg = container.querySelector(".error-message");
  if (msg) msg.remove();

  return true;
}