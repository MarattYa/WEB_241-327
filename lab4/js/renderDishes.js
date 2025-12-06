// js/renderDishes.js

document.addEventListener("DOMContentLoaded", () => {
  const soupContainer = document.querySelector("#soup-section .data-dish");
  const mainContainer = document.querySelector("#main-section .data-dish");
  const drinkContainer = document.querySelector("#drink-section .data-dish");

  const categories = {
    soup: soupContainer,
    main: mainContainer,
    drink: drinkContainer
  };

  const sorted = [...dishes].sort((a,b) => a.name.localeCompare(b.name));

  sorted.forEach(dish => {
    const card = document.createElement("div");

    card.className = "dish";
    card.setAttribute("data-dish", dish.keyword);

    card.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <h3>${dish.name}</h3>
      <p>${dish.count}</p>
      <p class="price">${dish.price}₽</p>
      <button class="add-btn">Добавить</button>
    `;

    // card.addEventListener("click", () => {
    //   window.addDishToOrder(dish.keyword);
    // });

    

    card.querySelector(".add-btn").addEventListener("click", (event) => {
      event.stopPropagation();

      // 1 — получаем позицию карточки
      const rect = card.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollLeft = window.scrollX || window.pageXOffset;

      // 2 — создаём копию
      const clone = card.cloneNode(true);
      clone.classList.add("flying");

      // 3 — ставим её поверх карточки
      clone.style.position = "absolute";
      clone.style.left = rect.left + scrollLeft + "px";
      clone.style.top = rect.top + scrollTop + "px";
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";
      clone.style.zIndex = 999;

      document.body.appendChild(clone);

      // 4 — вниз экрана (можем потом направить именно в блок заказа)
      const targetY = window.innerHeight - 80;

      requestAnimationFrame(() => {
        clone.style.transform = `translateY(${targetY - rect.top}px) scale(0.2)`;
        clone.style.opacity = "0";
      });

      // 5 — удаляем копию после анимации
      setTimeout(() => clone.remove(), 600);

      // 6 — логика добавления блюда
      window.addDishToOrder(dish.keyword);
    });

    categories[dish.category].appendChild(card);
  });
});