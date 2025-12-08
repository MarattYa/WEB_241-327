// js/order.js

window.order = {
  soup: null,
  main: null,
  salads_starters: null,
  drink: null,
  desserts: null
};

// Функция для снятия выделения со всех блюд категории
function unselectAllInCategory(category) {
  const categoryContainer = document.querySelector(`#${category}-section .data-dish`);
  if (categoryContainer) {
    const allDishes = categoryContainer.querySelectorAll('.dish');
    allDishes.forEach(dish => {
      dish.classList.remove('selected');
    });
  }
}

// Функция для выделения конкретного блюда
function selectDish(keyword) {
  // Находим блюдо по keyword
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;
  
  // Снимаем выделение со всех блюд в этой категории
  unselectAllInCategory(dish.category);
  
  // Находим DOM-элемент блюда и добавляем класс selected
  const dishElement = document.querySelector(`.dish[data-dish="${keyword}"]`);
  if (dishElement) {
    dishElement.classList.add('selected');
  }
}


function updateOrderView() {
   // элементы в DOM
  const soupEl = document.querySelector("#order-soup");
  const mainEl = document.querySelector("#order-main");
  const salad_starterEl = document.querySelector("#order-salads_starters");
  const drinkEl = document.querySelector("#order-drink");
  const desertEl = document.querySelector("#order-desserts");
  const totalEl = document.querySelector("#order-total");


  soupEl.textContent  = order.soup  ? order.soup.name  : "Ничего не выбрано";
  mainEl.textContent  = order.main  ? order.main.name  : "Ничего не выбрано";
  salad_starterEl.textContent = order.salads_starters ? order.salads_starters.name : "Ничего не выбрано";
  drinkEl.textContent = order.drink ? order.drink.name : "Ничего не выбрано";
  desertEl.textContent = order.desserts ? order.desserts.name : "Ничего не выбрано";

  const total =
    (order.soup?.price || 0) +
    (order.main?.price || 0) +
    (order.salads_starters?.price || 0) +
    (order.drink?.price || 0) +
    (order.desserts?.price || 0);
  
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

  selectDish(keyword);

  updateOrderView();
};
