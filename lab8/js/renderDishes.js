// js/renderDishes.js
document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();

  loadOrderFromStorage();

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
      onClick: () => {
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

        // Добавление блюда в заказ
        window.addDishToOrder(dish.keyword);
      }
    });

    container.appendChild(card);
  });

  restoreSelectedDishes(); // чтобы выбранные блюда остались выделены
}

  // Фильтры
  Object.keys(sections).forEach(category => {
    const filterBlock = sections[category].querySelector(".filters");
    if (!filterBlock) return;

    const buttons = filterBlock.querySelectorAll("button");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const isActive = btn.classList.contains("active");

        // Снимаем активность со всех кнопок
        buttons.forEach(b => b.classList.remove("active"));

        if (!isActive) {
          btn.classList.add("active");
          renderCategory(category, btn.dataset.kind);
        } else {
          renderCategory(category, null);
        }
      });
    });

    renderCategory(category); // начальная отрисовка без фильтра
  });

  restoreSelectedDishes();
  updateCartPanel();
});


function restoreSelectedDishes() {
  const saved = JSON.parse(localStorage.getItem("lunchOrder")) || {};

  Object.values(saved).forEach(keyword => {
    const card = document.querySelector(`.dish[data-dish="${keyword}"]`);
    if (card) card.classList.add("selected");
  });
}

function updateCartPanel() {
  const panel = document.getElementById("cart-panel");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-link");

  let total = 0;
  Object.values(window.order || {}).forEach(dish => {
    total += Number(dish.price);
  });

  totalEl.textContent = `${total} ₽`;

  if (total > 0) {
    panel.style.display = "flex";        // показываем панель
    checkoutBtn.classList.remove("disabled");
  } else {
    panel.style.display = "none";        // скрываем если заказ пустой
    checkoutBtn.classList.add("disabled");
  }
}

// Переход на страницу заказа по клику на кнопку
const checkoutBtn = document.getElementById("checkout-link");
checkoutBtn.addEventListener("click", () => {
  // Проверяем, что кнопка активна
  if (!checkoutBtn.classList.contains("disabled")) {
    window.location.href = "order.html";
  }
});