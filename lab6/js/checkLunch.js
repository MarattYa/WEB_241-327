// js/checkLunch.js
document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".order-form");

    if (!form) {
        console.error('Форма не найдена');
        return;
    }

    form.addEventListener("submit", (event) => {
        const order = window.order;

        event.preventDefault(); // стопаем стандартную отправку

        const hasSoup = !!order.soup;
        const hasMain = !!order.main;
        const hasSalad = !!order.salads_starters;
        const hasDrink = !!order.drink;
        const hasDessert = !!order.desserts;

        let message = "";

        // 1. Ничего не выбрано
        if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
        message = "Ничего не выбрано. Выберите блюда для заказа";
        }
        // 2. Нет напитка
        else if ((hasSoup || hasMain || hasSalad) && !hasDrink) {
        message = "Выберите напиток";
        }
        // 3. Есть суп, но нет главного/салата
        else if (hasSoup && !hasMain && !hasSalad) {
        message = "Выберите главное блюдо/салат/стартер";
        }
        // 4. Есть салат/стартер, но нет супа/главного
        else if (hasSalad && !hasSoup && !hasMain) {
        message = "Выберите суп или главное блюдо";
        }
        // 5. Есть напиток/десерт, но нет главного
        else if ((hasDrink || hasDessert) && !hasMain) {
        message = "Выберите главное блюдо";
        }

        if (message) {
            showNotification(message);
            return;
        }

        // Если всё ок
        form.submit();
  });


    // ========== УВЕДОМЛЕНИЕ ==========
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
});
