// js/renderDishes.js
document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();
  window.loadOrderFromStorage();

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
      const mode = window.order[dish.category]?.keyword === dish.keyword ? "remove" : "add";

      const card = renderDishCard(dish, {
        mode,
        onClick: () => handleAddDish(dish, card)
      });
      container.appendChild(card);
    });

    highlightSelected();
  }

  function handleAddDish(dish, card) {
    if (window.order[dish.category]?.keyword === dish.keyword){
      window.removeDishFromOrder(dish.category);
    } else {
      // Анимация "летящей карточки"
      const rect = card.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollLeft = window.scrollX || window.pageXOffset;

      const clone = card.cloneNode(true);
      clone.classList.add("flying");
      clone.style.position = "absolute";
      clone.style.left = rect.left + scrollLeft + "px";
      clone.style.top = rect.top + scrollTop + "px";
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";
      clone.style.zIndex = 999;
      document.body.appendChild(clone);
      const targetY = window.innerHeight - 80;
      requestAnimationFrame(() => {
        clone.style.transform = `translateY(${targetY - rect.top}px) scale(0.2)`;
        clone.style.opacity = "0";
      });
      setTimeout(() => clone.remove(), 600);
      window.addDishToOrder(dish.keyword);
    }
    
    highlightSelected();
    window.updateCartPanel();
  }

  function highlightSelected() {
    document.querySelectorAll(".dish.selected")
      .forEach(c => c.classList.remove("selected"));

    Object.values(window.order).forEach(dish => {
      const card = document.querySelector(`.dish[data-dish="${dish.keyword}"]`);
      if (card) card.classList.add("selected");
    });
  }

  // Фильтры
Object.keys(sections).forEach(category => {
  const filterBlock = sections[category].querySelector(".filters");
  if (!filterBlock) return;

  const buttons = filterBlock.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const active = btn.classList.contains("active");

      // Снимаем активность со всех кнопок
      buttons.forEach(b => b.classList.remove("active"));

      if (!active) {
        // Если кнопка не была активна, активируем её и фильтруем
        btn.classList.add("active");
        renderCategory(category, btn.dataset.kind);
      } else {
        // Если кнопка уже была активна, снимаем фильтр
        renderCategory(category, null);
      }
    });
  });

  // начальная отрисовка категории без фильтра
  renderCategory(category);
});

  // Переход на страницу заказа
  const checkoutBtn = document.getElementById("checkout-link");
  checkoutBtn.addEventListener("click", () => {
    if (!checkoutBtn.classList.contains("disabled")) {
      window.location.href = "order.html";
    }
  });

  // Начальное обновление панели
  window.updateCartPanel();
});
