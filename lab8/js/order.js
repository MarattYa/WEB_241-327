const STORAGE_KEY = "lunchOrder";
window.order = {};

function loadOrderFromStorage() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  Object.entries(saved).forEach(([category, keyword]) => {
    const dish = dishes.find(d => d.JSONkeyword === keyword);
    if (dish) order[category] = dish;
  });
}

function saveOrder() {
  const toSave = {};
  Object.entries(order).forEach(([category, dish]) => {
    toSave[category] = dish.keyword;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

function addDishToOrder(keyword) {
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  // ❗ снять подсветку с других в категории
  unselectCategory(dish.category);

  // ❗ подсветить текущую карточку
  const card = document.querySelector(`.dish[data-dish="${keyword}"]`);
  if (card) card.classList.add("selected");

  order[dish.category] = dish;
  saveOrder();
  updateOrderView();
  updateCartPanel();
}

function unselectCategory(category) {
  const section = document.querySelector(`#${category}-section`);
  if (!section) return;

  section.querySelectorAll(".dish.selected")
    .forEach(card => card.classList.remove("selected"));
}