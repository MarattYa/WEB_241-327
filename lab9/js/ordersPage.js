const API_KEY = "fa539060-cd45-4c8b-bfcd-db8592ca8e11";
const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api";

document.addEventListener("DOMContentLoaded", async () => {
  await loadDishes();
  const orders = await loadOrders();
  renderOrders(orders);
});

/* ---------- API ---------- */

async function loadOrders() {
  const res = await fetch(`${API_URL}/orders?api_key=${API_KEY}`);
  const data = await res.json();

  // сортировка по убыванию даты
  return data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function updateOrder(id, payload) {
  const res = await fetch(`${API_URL}/orders/${id}?api_key=${API_KEY}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Ошибка обновления");
}

async function deleteOrder(id) {
  const res = await fetch(`${API_URL}/orders/${id}?api_key=${API_KEY}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Ошибка удаления");
}

/* ---------- Render ---------- */

function renderOrders(orders) {
  const tbody = document.getElementById("orders-body");
  tbody.innerHTML = "";

  orders.forEach((order, index) => {
    const { dishesList, total } = collectDishes(order);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${formatDate(order.created_at)}</td>
      <td>${dishesList.join(", ")}</td>
      <td>${total} ₽</td>
      <td>${order.delivery_type === "by_time"
        ? order.delivery_time
        : "Как можно скорее (с 7:00 до 23:00)"}</td>
      <td>
        <button class="details-btn">👁</button>
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑</button>
      </td>
    `;

    tr.querySelector(".details-btn")
      .addEventListener("click", () => openDetailsModal(order));

    tr.querySelector(".edit-btn")
      .addEventListener("click", () => openEditModal(order));

    tr.querySelector(".delete-btn")
      .addEventListener("click", () => openDeleteModal(order.id));

    tbody.appendChild(tr);
  });
}

/* ---------- Helpers ---------- */

function collectDishes(order) {
  const ids = [
    order.soup_id,
    order.main_course_id,
    order.salad_id,
    order.drink_id,
    order.dessert_id,
  ];

  const dishesList = [];
  let total = 0;

  ids.forEach(id => {
    if (!id) return;
    const dish = dishes.find(d => d.id === id);
    if (dish) {
      dishesList.push(dish.name);
      total += Number(dish.price);
    }
  });

  return { dishesList, total };
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU") + " " +
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function closeModal() {
  document.getElementById("modal-container").innerHTML = "";
}

/* ---------- Modals ---------- */

function openDetailsModal(order) {
  const { dishesList, total } = collectDishes(order);

  document.getElementById("modal-container").innerHTML = `
    <div class="modal-overlay">
      <div class="modal">
        <h2>Просмотр заказа</h2>
        <p><b>Дата:</b> ${formatDate(order.created_at)}</p>
        <p><b>Получатель:</b> ${order.full_name}</p>
        <p><b>Адрес:</b> ${order.delivery_address}</p>
        <p><b>Телефон:</b> ${order.phone}</p>
        <p><b>Email:</b> ${order.email}</p>
        <p><b>Комментарий:</b> ${order.comment || "-"}</p>
        <p><b>Состав:</b> ${dishesList.join(", ")}</p>
        <p><b>Стоимость:</b> ${total} ₽</p>

        <button onclick="closeModal()">OK</button>
      </div>
    </div>
  `;
}

function openEditModal(order) {
  document.getElementById("modal-container").innerHTML = `
    <div class="modal-overlay">
      <div class="modal">
        <h2>Редактирование заказа</h2>

        <input id="edit-name" value="${order.full_name}">
        <input id="edit-email" value="${order.email}">
        <input id="edit-phone" value="${order.phone}">
        <input id="edit-address" value="${order.delivery_address}">
        <textarea id="edit-comment">${order.comment || ""}</textarea>

        <div class="modal-actions">
          <button onclick="closeModal()">Отмена</button>
          <button id="save-btn">Сохранить</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("save-btn").onclick = async () => {
    try {
      await updateOrder(order.id, {
        full_name: document.getElementById("edit-name").value,
        email: document.getElementById("edit-email").value,
        phone: document.getElementById("edit-phone").value,
        delivery_address: document.getElementById("edit-address").value,
        comment: document.getElementById("edit-comment").value,
      });

      alert("Заказ успешно изменён");
      closeModal();
      renderOrders(await loadOrders());

    } catch (e) {
      alert(e.message);
    }
  };
}

function openDeleteModal(orderId) {
  document.getElementById("modal-container").innerHTML = `
    <div class="modal-overlay">
      <div class="modal">
        <h2>Удаление заказа</h2>
        <p>Вы уверены, что хотите удалить заказ?</p>
        <div class="modal-actions">
          <button onclick="closeModal()">Отмена</button>
          <button id="confirm-delete">Да</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("confirm-delete").onclick = async () => {
    try {
      await deleteOrder(orderId);
      alert("Заказ удалён");
      closeModal();
      renderOrders(await loadOrders());
    } catch (e) {
      alert(e.message);
    }
  };
}
