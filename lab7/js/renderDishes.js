// js/renderDishes.js

document.addEventListener("DOMContentLoaded",async () => {

  await loadDishes();

  const sections = {
    soup: document.querySelector("#soup-section"),
    main: document.querySelector("#main-section"),
    salad: document.querySelector("#salads_starters-section"),
    drink: document.querySelector("#drink-section"),
    dessert: document.querySelector("#desserts-section")
  };

  function renderCategory(category, filter = null){
    const container = sections[category].querySelector(".data-dish");
    container.innerHTML = "";
    
    let list = dishes.filter(d=>d.category === category);

    if(filter) {
      list = list.filter(d => d.kind === filter);
    }

    list.forEach(dish => {
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

      card.addEventListener("click", (event) => {
        // Клик по карточке или кнопке = одно и то же
        event.stopPropagation(); // чтобы не было двойного вызова при клике на кнопку

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
      });

      container.appendChild(card);
    });
  }
  // Фильтры
  Object.keys(sections).forEach(category => {
    const filterBlock = sections[category].querySelector(".filters");
    if(!filterBlock) return;

    const buttons = filterBlock.querySelectorAll("button");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const active = btn.classList.contains("active");

        buttons.forEach(b => b.classList.remove("active"));

        if(!active) {
          btn.classList.add("active");
          renderCategory(category, btn.dataset.kind);
        } else {
          renderCategory(category,null);
        }
      });
    });

    renderCategory(category);

  });
});