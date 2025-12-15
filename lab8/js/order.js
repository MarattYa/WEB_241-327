// Используем глобальную переменную, если её ещё нет
window.STORAGE_KEY = window.STORAGE_KEY || "lunchOrder";
window.order = window.order || {};

// Загружаем заказ из localStorage
function loadOrderFromStorage() {
  const saved = JSON.parse(localStorage.getItem(window.STORAGE_KEY)) || {};

  Object.entries(saved).forEach(([category, keyword]) => {
    const dish = dishes.find(d => d.keyword === keyword); // исправлено JSONkeyword → keyword
    if (dish) window.order[category] = dish;
  });
}

// Сохраняем заказ в localStorage
function saveOrder() {
  const toSave = {};
  Object.entries(window.order).forEach(([category, dish]) => {
    toSave[category] = dish.keyword;
  });
  localStorage.setItem(window.STORAGE_KEY, JSON.stringify(toSave));
}

// Добавление блюда в заказ
function addDishToOrder(keyword) {
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  // снять подсветку с других блюд в категории
  unselectCategory(dish.category);

  // подсветить текущую карточку
  const card = document.querySelector(`.dish[data-dish="${keyword}"]`);
  if (card) card.classList.add("selected");

  window.order[dish.category] = dish;
  saveOrder();
  updateCartPanel();

  // Обновляем отображение заказа, если функция есть
  if (typeof updateOrderView === "function") {
    updateOrderView();
  }

  if (typeof updateCartPanel === "function") updateCartPanel();
}

// Снять выделение с других блюд в категории
function unselectCategory(category) {
  const section = document.querySelector(`#${category}-section`);
  if (!section) return;

  section.querySelectorAll(".dish.selected")
    .forEach(card => card.classList.remove("selected"));
}

//обновление текстовых полей выбранных блюд и итоговой суммы
function updateOrderView() {
  const fields = {
    soup: document.getElementById("order-soup"),
    main: document.getElementById("order-main"),
    salads_starters: document.getElementById("order-salads_starters"),
    drink: document.getElementById("order-drink"),
    desserts: document.getElementById("order-desserts"),
  };

  let total = 0;

  Object.entries(window.order).forEach(([category, dish]) => {
    if (fields[category]) {
      fields[category].textContent = dish.name;
      total += Number(dish.price);
    }
  });

  const totalEl = document.getElementById("order-total");
  if (total > 0) {
    totalEl.style.display = "block";
    totalEl.textContent = `Итоговая стоимость: ${total} ₽`;
  } else {
    totalEl.style.display = "none";
  }
}