let dishes = [];

const CATEGORY_NORMALIZE_MAP = {
  "main-course": "main",
  "salads_starters": "salad",
  "desserts": "dessert",
};

async function loadDishes() {
  const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
  const raw = await response.json();

  dishes = raw.map(dish => ({
    ...dish,
    category: CATEGORY_NORMALIZE_MAP[dish.category] || dish.category
  }));
}
