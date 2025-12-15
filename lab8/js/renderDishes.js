// js/renderDishes.js
document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();

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
        onClick: () => window.addDishToOrder(dish.keyword)
      });

      container.appendChild(card);
    });
  }

  Object.keys(sections).forEach(category => {
    renderCategory(category);
  });

  restoreSelectedDishes();
});

function restoreSelectedDishes() {
  const saved = JSON.parse(localStorage.getItem("lunchOrder")) || {};

  Object.values(saved).forEach(keyword => {
    const card = document.querySelector(`.dish[data-dish="${keyword}"]`);
    if (card) card.classList.add("selected");
  });
}

restoreSelectedDishes();