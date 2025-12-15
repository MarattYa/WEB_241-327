// js/orderPage.js

const STORAGE_KEY = "lunchOrder";
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
const container = document.querySelector(".order-dishes");


document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();
  loadOrderFromStorage();

    if (!Object.keys(saved).length) {
    container.innerHTML = `
      <p>
        Ничего не выбрано.
        <a href="lunch.html">Собрать ланч</a>
      </p>
    `;
    return;
  }

  Object.entries(saved).forEach(([category, keyword]) => {
    const dish = dishes.find(d => d.keyword === keyword);
    if (!dish) return;

    const card = renderDishCard(dish, {
      mode: "remove",
      onClick: () => {
        removeDishFromOrder(category);
        card.remove();
        
      }
    });

    container.appendChild(card);
  });
  updateOrderView();
});