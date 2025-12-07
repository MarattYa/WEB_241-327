const dishes = [
    //soups
    {
        keyword: "gazpacho",
        name: "Гаспачо",
        price: 195,
        category: "soup",
        count: "350 g",
        image: "src/menu/soups/gazpacho.jpg",
        kind: "veg"
    },
    {
        keyword: "mushroom_puree",
        name: "Грибной суп-пюре",
        price: 185,
        category: "soup",
        count: "330 г",
        image: "src/menu/soups/mushroom_soup.jpg",
        kind: "veg"
    },
    {
        keyword: "norwegian",
        name: "Норвежский суп",
        price: 270,
        category: "soup",
        count: "330 г",
        image: "src/menu/soups/norwegian_soup.jpg",
        kind: "fish"
    },
    {
        keyword: "chicken",
        name: "Куриный суп",
        price: 330,
        category: "soup",
        count: "350 г",
        image: "src/menu/soups/chicken.jpg",
        kind: "meat"
    },
    {
        keyword: "ramen",
        name: "Рамен",
        price: 375,
        category: "soup",
        count: "425 г",
        image: "src/menu/soups/ramen.jpg",
        kind: "meat"
    },
    {
        keyword: "tomyum",
        name: "Норвежский суп",
        price: 650,
        category: "soup",
        count: "500 г",
        image: "src/menu/soups/tomyum.jpg",
        kind: "fish"
    },

    //main
    {
        keyword: "fried_potatoes",
        name: "Жареная картошка с грибами",
        price: 150,
        category: "main",
        count: "250 г",
        image: "src/menu/main_course/friedpotatoeswithmushrooms1.jpg",
        kind: "veg"
    },
    {
        keyword: "lasagna",
        name: "Лазанья",
        price: 385,
        category: "main",
        count: "310 г",
        image: "src/menu/main_course/lasagna.jpg",
        kind: "meat"
    },
    {
        keyword: "chicken_cutlets",
        name: "Котлеты из курицы с картофельным пюре",
        price: 225,
        category: "main",
        count: "280 г",
        image: "src/menu/main_course/chickencutletsandmashedpotatoes.jpg",
        kind: "meat"
    },
    {
        keyword: "fishrice",
        name: "Рыбная котлета с рисом и спаржей",
        price: 320,
        category: "main",
        count: "270 г",
        image: "src/menu/main_course/fishrice.jpg",
        kind: "fish"
    },
    {
        keyword: "shrimppasta",
        name: "Паста с креветками",
        price: 340,
        category: "main",
        count: "280 г",
        image: "src/menu/main_course/shrimppasta.jpg",
        kind: "fish"
    },
    {
        keyword: "pizza",
        name: "Пицца Маргарита",
        price: 450,
        category: "main",
        count: "470 г",
        image: "src/menu/main_course/pizza.jpg",
        kind: "veg"
    },

    //salads and starters
    {
        keyword: "caesar",
        name: "Цезарь с цыпленком",
        price: 370,
        category: "salads_starters",
        count: "220 г",
        image: "src/menu/salads_starters/caesar.jpg",
        kind: "meat"
    },
    {
        keyword: "caprese",
        name: "Капрезе с моцареллой",
        price: 350,
        category: "salads_starters",
        count: "235 г",
        image: "src/menu/salads_starters/caprese.jpg",
        kind: "veg"
    },
    {
        keyword: "saladwithegg",
        name: "Корейский салат с овощами и яйцом",
        price: 330,
        category: "salads_starters",
        count: "250 г",
        image: "src/menu/salads_starters/saladwithegg.jpg",
        kind: "veg"
    },
    {
        keyword: "tunasalad",
        name: "Салат с тунцом",
        price: 480,
        category: "salads_starters",
        count: "250 г",
        image: "src/menu/salads_starters/tunasalad.jpg",
        kind: "fish"
    },
    {
        keyword: "frenchfries1",
        name: "Картофель фри с соусом Цезарь",
        price: 280,
        category: "salads_starters",
        count: "235 г",
        image: "src/menu/salads_starters/frenchfries1.jpg",
        kind: "veg"
    },
    {
        keyword: "frenchfries2",
        name: "Картофель фри с кетчупом",
        price: 260,
        category: "salads_starters",
        count: "235 г",
        image: "src/menu/salads_starters/frenchfries2.jpg",
        kind: "veg"
    },

    //Drinks
    {
        keyword: "orange_juice",
        name: "Апельсиновый сок",
        price: 120,
        category: "drink",
        count: "300 мл",
        image: "src/menu/beverages/orangejuice.jpg",
        kind: "cold"
    },
    {
        keyword: "apple_juice",
        name: "Яблочный сок",
        price: 90,
        category: "drink",
        count: "300 мл",
        image: "src/menu/beverages/applejuice.jpg",
        kind: "cold"
    },
    {
        keyword: "carrot_juice",
        name: "Морковный сок",
        price: 110,
        category: "drink",
        count: "330 мл",
        image: "src/menu/beverages/carrotjuice.jpg",
        kind: "cold"
    },
    {
        keyword: "cappuccino",
        name: "Капучино",
        price: 180,
        category: "drink",
        count: "300 мл",
        image: "src/menu/beverages/cappuccino.jpg",
        kind: "hot"
    },
    {
        keyword: "greentea",
        name: "Зеленый чай",
        price: 100,
        category: "drink",
        count: "300 мл",
        image: "src/menu/beverages/greentea.jpg",
        kind: "hot"
    },
    {
        keyword: "tea",
        name: "Черный чай",
        price: 90,
        category: "drink",
        count: "300 мл",
        image: "src/menu/beverages/tea.jpg",
        kind: "hot"
    },

    //desserts
    {
        keyword: "baklava",
        name: "Пахлава",
        price: 220,
        category: "desserts",
        count: "300 г",
        image: "src/menu/desserts/baklava.jpg",
        kind: "middle"
    },
    {
        keyword: "checheesecake",
        name: "Чизкейк",
        price: 240,
        category: "desserts",
        count: "125 г",
        image: "src/menu/desserts/checheesecake.jpg",
        kind: "small"
    },
    {
        keyword: "chocolatecake",
        name: "Шоколадный чизкейк",
        price: 260,
        category: "desserts",
        count: "125 г",
        image: "src/menu/desserts/chocolatecake.jpg",
        kind: "small"
    },
    {
        keyword: "chocolatecheesecake",
        name: "Шоколадный торт",
        price: 270,
        category: "desserts",
        count: "140 г",
        image: "src/menu/desserts/chocolatecheesecake.jpg",
        kind: "big"
    },
    {
        keyword: "donuts",
        name: "Пончики(3 штуки)",
        price: 410,
        category: "desserts",
        count: "350 г",
        image: "src/menu/desserts/donuts.jpg",
        kind: "small"
    },
    {
        keyword: "donuts2",
        name: "Пончики(6 штук)",
        price: 650,
        category: "desserts",
        count: "700 г",
        image: "src/menu/desserts/donuts2.jpg",
        kind: "middle"
    },

];