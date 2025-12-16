// js/orderPage.js
document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();
  window.loadOrderFromStorage();

  const container = document.querySelector(".order-dishes");
  const saved = JSON.parse(localStorage.getItem("lunchOrder")) || {};

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
        window.removeDishFromOrder(category);
        card.remove();
      }
    });

    container.appendChild(card);
  });

  window.updateOrderView();
});
