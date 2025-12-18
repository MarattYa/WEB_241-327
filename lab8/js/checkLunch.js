window.checkLunch = function () {
  const order = window.order;

  const hasSoup = !!order.soup;
  const hasMain = !!order.main;
  const hasSalad = !!order.salad;
  const hasDrink = !!order.drink;
  const hasDessert = !!order.dessert;

  let message = "";

  if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
    message = "Ничего не выбрано. Выберите блюда для заказа";
  }
  else if ((hasSoup || hasMain || hasSalad) && !hasDrink) {
    message = "Выберите напиток";
  }
  else if (hasSoup && !hasMain && !hasSalad) {
    message = "Выберите главное блюдо или салат";
  }
  else if (hasSalad && !hasSoup && !hasMain) {
    message = "Выберите суп или главное блюдо";
  }
  else if ((hasDrink || hasDessert) && !hasMain) {
    message = "Выберите главное блюдо";
  }

  if (message) {
    showNotification(message);
    return false;
  }

  return true;
};

// уведомление
function showNotification(text) {
  const old = document.querySelector(".notify-overlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.className = "notify-overlay";

  const modal = document.createElement("div");
  modal.className = "notify-modal";

  modal.innerHTML = `
    <p>${text}</p>
    <button class="notify-btn">Окей</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector(".notify-btn").addEventListener("click", () => {
    overlay.remove();
  });
}
