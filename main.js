const loginButton = document.querySelector('.button-login');
const authModal = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginInput = document.getElementById('login');
const loginError = document.getElementById('loginError');
const userName = document.querySelector('.user-name');
const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const loginForm = document.getElementById('logInForm');
const passwordInput = document.getElementById('password');
const passwordError = document.getElementById('passwordError');
const cartButton = document.getElementById('cart-button');
const modalCart = document.querySelector('.modal-cart');
const closeCart = document.querySelector('.modal-cart .close');
const modalBody = document.querySelector('.modal-body');
const modalPricetag = document.querySelector('.modal-pricetag');
const clearCartButton = document.querySelector('.clear-cart');
const searchInput = document.querySelector('.input-search');
const orderButton = document.querySelector('.modal-footer .button-primary');
const thanksModal = document.createElement('div');

thanksModal.classList.add('modal', 'modal-thanks');
thanksModal.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title">Дякуємо за замовлення!</h3>
    </div>
    <div class="modal-body">
      <p>Ваше замовлення прийнято в обробку.</p>
      <p>Очікуйте дзвінка від нашого оператора.</p>
    </div>
    <div class="modal-footer">
      <button class="button button-primary thanks-close">Гаразд</button>
    </div>
  </div>
`;

document.body.appendChild(thanksModal);

const thanksCloseButton = thanksModal.querySelector('.thanks-close');

let authModalIsOpen = false;
let cart = [];

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Функція для збереження кошика в localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Завантажуємо кошик при завантаженні сторінки
loadCartFromLocalStorage();

function showAuthModal() {
    authModal.style.display = 'block';
    authModalIsOpen = true;
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authModal.style.display = 'none';
    loginInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
    loginError.style.display = 'none';
    passwordError.style.display = 'none';
    loginInput.value = '';
    passwordInput.value = '';
    authModalIsOpen = false;
    document.body.style.overflow = '';
}

function authorize(login) {
    closeAuthModal();
    localStorage.setItem('userName', login);
    userName.textContent = login;
    userName.style.display = 'inline';
    buttonAuth.style.display = 'none';
    buttonOut.style.display = 'inline';
    cartButton.style.display = 'inline';
}

function logout() {
    localStorage.removeItem('userName');
    userName.textContent = '';
    userName.style.display = 'none';
    buttonAuth.style.display = 'inline';
    buttonOut.style.display = 'none';
    cartButton.style.display = 'none';
}

function checkAuth() {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
        authorize(storedUserName);
    } else {
        cartButton.style.display = 'none';
    }
}


loginButton.addEventListener('click', (event) => {
    event.preventDefault();

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login) {
        loginInput.style.borderColor = 'red';
        loginError.style.display = 'block';
    }

    if (!password) {
        passwordInput.style.borderColor = 'red';
        passwordError.style.display = 'block';
    }

    if (!login || !password) {
        return;
    }

    authorize(login);
});


buttonAuth.addEventListener('click', showAuthModal);
buttonOut.addEventListener('click', logout);
closeAuth.addEventListener('click', closeAuthModal);

window.addEventListener('click', (event) => {
    if (authModalIsOpen && event.target === authModal) {
        closeAuthModal();
    }
    if (event.target === thanksModal) {
        thanksModal.style.display = 'none';
        document.body.style.overflow = '';
      }
});


function renderRestaurants(restaurants) {
    const restaurantsContainer = document.querySelector('.cards-restaurants');
    restaurantsContainer.innerHTML = '';

    restaurants.forEach(restaurant => {
        const card = document.createElement('a');
        card.href = `restaurant.html?restaurant=${encodeURIComponent(restaurant.name)}`;
        card.classList.add('card', 'card-restaurant');

        card.innerHTML = `
            <img src="${restaurant.image}" alt="image" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${restaurant.name}</h3>
                    <span class="card-tag tag">${restaurant.time}</span>
                </div>
                <div class="card-info">
                    <div class="rating">${restaurant.rating}</div>
                    <div class="price">від ${restaurant.price} ₴</div>
                    <div class="category">${restaurant.category}</div>
                </div>
            </div>
        `;
        restaurantsContainer.appendChild(card);
    });

    addRestaurantCardClickHandlers();
}


function addRestaurantCardClickHandlers() {
    const restaurantCards = document.querySelectorAll('.card-restaurant');
    restaurantCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const storedUserName = localStorage.getItem('userName');
            if (!storedUserName) {
                event.preventDefault();
                showAuthModal();
            }
        });
    });
}


async function fetchMenu(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Помилка при отриманні меню:', error);
        return null;
    }
}



function renderMenu(menuItems) {
    const cardsMenu = document.querySelector('.cards-menu');
    cardsMenu.innerHTML = '';


    if (!menuItems || menuItems.length === 0) {
        cardsMenu.innerHTML = '<p>Меню наразі недоступне.</p>';
        return;
    }

    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${item.image}" alt="image" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">${item.name}</h3>
                </div>
                <div class="card-info">
                    <div class="ingredients">${item.description}</div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary button-add-cart">
                        <span class="button-card-text">У кошик</span>
                        <span class="button-cart-svg"></span>
                    </button>
                    <strong class="card-price-bold">${item.price} ₴</strong>
                </div>
            </div>
        `;



        const addToCartButton = card.querySelector('.button-add-cart');
        addToCartButton.addEventListener('click', () => {
            addToCart(item);
        });
        cardsMenu.appendChild(card);
    });
}


function renderRestaurantInfo(restaurant) {
    const restaurantTitle = document.querySelector('.restaurant-title');
    const rating = document.querySelector('.card-info .rating');
    const price = document.querySelector('.card-info .price');
    const category = document.querySelector('.card-info .category');

    if (restaurantTitle) restaurantTitle.textContent = restaurant.name;
    if (rating) rating.textContent = restaurant.stars;
    if (price) price.textContent = `От ${restaurant.price} ₴`;
    if (category) category.textContent = restaurant.kitchen;
}

document.addEventListener('DOMContentLoaded', async () => {
    const restaurantTitleElement = document.querySelector('.restaurant-title');
    if (restaurantTitleElement) {
        restaurantTitleElement.textContent = 'Завантаження...';
    }


    const urlParams = new URLSearchParams(window.location.search);
    const restaurantName = urlParams.get('restaurant');

    console.log('Отримано ім\'я ресторану з URL:', restaurantName);

    if (restaurantName) {
        try {

            const selectedRestaurant = restaurants.find(r => r.name === restaurantName);

            console.log('Знайдено ресторан в db.js:', selectedRestaurant);

            if (selectedRestaurant) {

                const partnersResponse = await fetch('partners.json');
                if (!partnersResponse.ok) {
                    throw new Error(`HTTP error! status: ${partnersResponse.status}`);
                }
                const partners = await partnersResponse.json();
                const detailedRestaurantInfo = partners.find(p => p.name === restaurantName);

                console.log('Знайдено інформацію про ресторан в partners.json:', detailedRestaurantInfo);


                if (detailedRestaurantInfo) {
                    renderRestaurantInfo(detailedRestaurantInfo);


                    const menuData = await fetchMenu(detailedRestaurantInfo.products);
                    console.log('Отримано дані меню:', menuData);
                    renderMenu(menuData);
                } else {
                    console.error(`Деталі ресторану не знайдено в partners.json для: ${restaurantName}`);
                    if (restaurantTitleElement) {
                        restaurantTitleElement.textContent = 'Інформацію про ресторан не знайдено.';
                    }
                }
            } else {
                console.error(`Ресторан не знайдено в db.js: ${restaurantName}`);
                if (restaurantTitleElement) {
                    restaurantTitleElement.textContent = 'Ресторан не знайдено.';
                }
            }
        } catch (error) {
            console.error('Помилка при отриманні даних:', error);
            if (restaurantTitleElement) {
                restaurantTitleElement.textContent = 'Помилка завантаження даних.';
            }
        }
    } else {
        console.error('Ім\'я ресторану не передано в URL.');
        if (restaurantTitleElement) {
            restaurantTitleElement.textContent = 'Не вказано ресторан.';
        }
    }


    checkAuth();
});


if (document.querySelector('.cards-restaurants')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderRestaurants(restaurants);
        checkAuth();
    });
}




function updateCart() {
    modalBody.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        modalBody.innerHTML = '<p>Кошик пустий.</p>';
        modalPricetag.textContent = `${totalPrice} ₴`;
        return;
    }

    cart.forEach(item => {
        const foodRow = document.createElement('div');
        foodRow.classList.add('food-row');
        foodRow.innerHTML = `
            <span class="food-name">${item.name}</span>
            <strong class="food-price">${item.price} ₴</strong>
            <div class="food-counter">
                <button class="counter-button counter-minus" data-id="${item.id}">-</button>
                <span class="counter">${item.quantity}</span>
                <button class="counter-button counter-plus" data-id="${item.id}">+</button>
            </div>
        `;
        modalBody.appendChild(foodRow);
        totalPrice += item.price * item.quantity;
    });

    modalPricetag.textContent = `${totalPrice} ₴`;

    const counterMinusButtons = document.querySelectorAll('.counter-minus');
    const counterPlusButtons = document.querySelectorAll('.counter-plus');

    counterMinusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.id;
            const item = cart.find(item => item.id === itemId);

            if (item && item.quantity > 1) {
                item.quantity--;
                updateCart();
            }
        });
    });

    counterPlusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.id;
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity++;
                updateCart();
            }

        });
    });
}


cartButton.addEventListener('click', () => {
    modalCart.style.display = 'flex';
    updateCart();
    document.body.style.overflow = 'hidden';
});


closeCart.addEventListener('click', () => {
    modalCart.style.display = 'none';
    document.body.style.overflow = '';
});


clearCartButton.addEventListener('click', () => {
    cart = [];
    updateCart();
});


window.addEventListener('click', (event) => {
    if (event.target === modalCart) {
        modalCart.style.display = 'none';
        document.body.style.overflow = '';
    }
});



function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
}

orderButton.addEventListener('click', () => {
    modalCart.style.display = 'none';
    thanksModal.style.display = 'flex';
    cart = [];
    updateCart();
    document.body.style.overflow = 'hidden';
});

thanksCloseButton.addEventListener('click', () => {
    thanksModal.style.display = 'none';
    document.body.style.overflow = '';
});

async function fetchPartners() {
    try {
        const response = await fetch('partners.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Помилка при отриманні partners.json:', error);
        return [];
    }
}

function renderMenuError(message) {
    const cardsMenu = document.querySelector('.cards-menu');
    cardsMenu.innerHTML = '';
    cardsMenu.innerHTML = `<p class="error-message">${message}</p>`;

}


searchInput.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        const searchText = this.value.trim().toLowerCase();

        if (!searchText) {
            this.style.borderColor = 'red';
            setTimeout(() => {
                this.style.borderColor = '';
            }, 1000);
            return;
        }

        const isRestaurantPage = !!document.querySelector('.restaurant-title');

        if (isRestaurantPage) {

            const restaurantName = new URLSearchParams(window.location.search).get('restaurant');
            
                try {
                    const selectedRestaurant = restaurants.find(r => r.name === restaurantName);
        
                    if (selectedRestaurant) {
                        const partners = await fetchPartners();
                        const detailedRestaurantInfo = partners.find(p => p.name === restaurantName);
        
                        if (detailedRestaurantInfo) {
                            const menuData = await fetchMenu(detailedRestaurantInfo.products);
        
                            if (menuData) {
                                const filteredMenu = menuData.filter(item => {
                                  return item.name.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText);
                                });
                                renderMenu(filteredMenu);
                            } else {
                                renderMenuError("Помилка при отриманні меню.");
                            }
                        } else {
                             renderMenuError(`Ресторан ${restaurantName} не знайдений.`);
                           
                        }
                    } else {
                        renderMenuError(`Ресторан ${restaurantName} не знайдений.`);
                    }
                } catch (error) {
                    renderMenuError("Помилка при завантаженні даних.");
                    console.error('Помилка:', error);
                }

        } else {
            const filteredRestaurants = restaurants.filter(restaurant => {
                return restaurant.name.toLowerCase().includes(searchText) || restaurant.category.toLowerCase().includes(searchText);
            });
            renderRestaurants(filteredRestaurants);
        }
    }
});

function searchRestaurants(query) {
    const filteredRestaurants = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
               restaurant.category.toLowerCase().includes(query.toLowerCase());
    });
    renderRestaurants(filteredRestaurants);
}



async function searchDishes(query) {
    const results = [];
    for (const restaurant of restaurants) {
      const urlParams = new URLSearchParams();
      urlParams.set('restaurant', restaurant.name);

      const partnersResponse = await fetch('partners.json');
      const partners = await partnersResponse.json();
      const restaurantInfo = partners.find(p => p.name === restaurant.name);
      
      if(restaurantInfo) {
        const menu = await fetchMenu(restaurantInfo.products);
        if (menu) {
            const filteredMenu = menu.filter(dish =>
                dish.name.toLowerCase().includes(query.toLowerCase()) ||
                dish.description.toLowerCase().includes(query.toLowerCase())
            );
            filteredMenu.forEach(dish => {
                results.push({ ...dish, restaurant: restaurant.name });
            });
        }
      }
    }

    const menuContainer = document.querySelector('.cards-menu');
    if (menuContainer) {
        renderMenu(results);
    }
}

searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query === '') {
            searchInput.style.borderColor = 'red';
            setTimeout(() => {
                searchInput.style.borderColor = '';
            }, 1000);
            return;
        }

        if(window.location.pathname.endsWith('index.html')) {
            searchRestaurants(query);
        } else if (window.location.pathname.endsWith('restaurant.html')) {
            await searchDishes(query);
        }

    }
});