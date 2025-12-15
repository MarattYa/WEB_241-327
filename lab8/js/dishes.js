let dishes = [];

async function loadDishes() {
  const response = await fetch(
    'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes'
  );
  dishes = await response.json();
}
