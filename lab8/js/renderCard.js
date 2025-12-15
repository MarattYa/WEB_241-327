// js/renderCard.js
function renderDishCard(dish, { mode, onClick }) {
  const card = document.createElement("div");
  card.className = "dish";
  card.dataset.dish = dish.keyword;

  const buttonText = mode === "remove" ? "Удалить" : "Добавить";

  card.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}">
    <h3>${dish.name}</h3>
    <p>${dish.count}</p>
    <p class="price">${dish.price}₽</p>
    <button class="add-btn">${buttonText}</button>
  `;

  card.querySelector("button").addEventListener("click", e => {
    e.stopPropagation();
    onClick(dish.keyword);
  });

  return card;
}