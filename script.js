// === Globale Variablen ===
let basket = {};
const deliveryFeeFixed = 5.95;

// === Initialer Render ===
function render() {
  const categories = Object.keys(allDishes);
  categories.forEach(category => {
    fillDiv(category, category + '-list');
  });
}

function fillDiv(catName, catDiv) {
  const dishGroup = document.getElementById(catDiv);
  if (!dishGroup) return console.error(`Element '${catDiv}' nicht gefunden.`);

  let dishList = '';
  allDishes[catName].forEach(dish => {
    dishList += dishTemplate(dish.name, dish.infos, dish.price);
  });
  dishGroup.innerHTML = dishList;
}

function formatePrice(price) {
  return price.toFixed(2).toString().replace('.', ',');
}

// === Hauptfunktionen ===
function addDish(productName, price) {
  if (basket[productName]) {
    basket[productName].quantity++;
  } else {
    basket[productName] = { quantity: 1, price };
  }
  renderBasket();  
}

function calculateTotal() {
  // Add calculation code here
  let total = 0;
  for (let i = 0; i < basket.length; i++) { //Assume you have a variable called basket with your item information
    total += basket[i].price * basket[i].quantity;
  }
  const delivery = document.getElementById("delivery")?.checked;
  const deliveryFee = 5.95; // Lieferkosten
  if (delivery) {
    total += deliveryFee; // Add delivery fee if checked
  }
  return total;
}

function renderBasket() {
  const views = ['mobile', 'desktop'];
  const elements = getElements();

  clearBasketViews(elements.basketContent);

  const { subtotal, totalItems } = fillBasketContent(elements.basketContent);

  if (totalItems === 0) {
    showEmptyBasketText(elements.basketContent);
  }

  const service = subtotal > 0 ? 5.95 : 0;
  const total = subtotal + service;

  updateTotalsAndControls(elements, subtotal, service, total, totalItems);
}

function getElements() {
  return {
    basketContent: getDualElement('basket-content', 'basket-content-desktop'),
    subtotal: getDualElement('subtotal', 'subtotal-desktop'),
    service: getDualElement('service', 'service-desktop'),
    total: getDualElement('total', 'total-desktop'),
    items: getDualElement('items', 'items-desktop'),
    reset: getDualElement('reset', 'reset-desktop'),
    send: getDualElement('send', 'send-desktop'),
    delivery: getDualElement('delivery', 'delivery-desktop'),
  };
}

function getDualElement(mobileID, desktopID) {
  return {
    mobile: document.getElementById(mobileID),
    desktop: document.getElementById(desktopID)
  };
}

function clearBasketViews(basketContent) {
  Object.values(basketContent).forEach(el => el.innerHTML = '');
}

function fillBasketContent(basketContent) {
  let subtotal = 0, totalItems = 0;

  for (const [dish, { quantity, price }] of Object.entries(basket)) {
    const sum = quantity * price;
    subtotal += sum;
    totalItems += quantity;

    const html = basketItemHTML(dish, quantity, sum);
    Object.values(basketContent).forEach(el => el.innerHTML += html);
  }

  return { subtotal, totalItems };
}

function basketItemHTML(dish, quantity, sum) {
  return `
    <div class="basket_item">
      <span>${dish}</span>
      <div class="basket_controls">
        <img src="./icons_images/minus.svg" class="quantity-btn" onclick="removeFromBasket('${dish}')">
        <span>${quantity}</span>
        <img src="./icons_images/plus.svg" class="quantity-btn" onclick="addToBasket('${dish}')">
      </div>
      <div class="basket_price">${sum.toFixed(2)} €</div>
    </div>
  `;
}

function showEmptyBasketText(basketContent) {
  basketContent.mobile.innerHTML = `<span class="empty_basket">Ihr Warenkorb ist wieder leer</span>`;
  basketContent.desktop.innerHTML = `<span class="empty_basket">Leer</span>`;
}

function updateTotalsAndControls(elements, subtotal, service, total, totalItems) {
  ['mobile', 'desktop'].forEach(view => {
    elements.subtotal[view].innerText = subtotal.toFixed(2);
    elements.service[view].innerText = service.toFixed(2);
    elements.total[view].innerText = total.toFixed(2);
    elements.items[view].innerText = totalItems;
    elements.reset[view].classList.toggle('d-none', totalItems === 0);
    elements.send[view].parentElement.classList.toggle('d-none', totalItems === 0);
    elements.delivery[view].disabled = totalItems === 0;
  });
}

function generateBasketItemsHTML(contentArray) {
  return contentArray.map(([product, data]) =>
    basketItemTemplate(product, data.quantity, data.price)
  ).join('');
}

function updateBasketView(suffix, contentHTML, itemCount, emptyText) {
  const contentId = `basket-content${suffix}`;
  const contentEl = document.getElementById(contentId);
  if (!contentEl) return;

  contentEl.innerHTML = contentHTML || emptyText;
  document.getElementById(`items${suffix}`).textContent = itemCount;
  document.getElementById(`reset${suffix}`).classList.toggle('d-none', itemCount === 0);
  document.getElementById(`send${suffix}`).classList.toggle('d-none', itemCount === 0);
  document.getElementById(`delivery${suffix}`).disabled = itemCount === 0;
}

function updateBasket(contentArray) {
  const basketItemsHTML = generateBasketItemsHTML(contentArray);
  const itemCount = contentArray.length;

  const views = {
    '': {
      emptyText: '<span class="empty_basket">Ihr Warenkorb ist wieder leer</span>'
    },
    '-desktop': {
      emptyText: '<span class="empty_basket">Leer</span>'
    }
  };

  for (const suffix in views) {
    updateBasketView(suffix, basketItemsHTML, itemCount, views[suffix].emptyText);
  }

  calculateAmounts();
}

function calculateAmounts() {
  const subtotal = calculateSum();
  const delivery = getDeliveryFee();
  const total = subtotal + delivery;

  const views = ['', '-desktop'];
  for (const suffix of views) {
    document.getElementById(`subtotal${suffix}`).textContent = formatePrice(subtotal);
    document.getElementById(`service${suffix}`).textContent = formatePrice(delivery);
    document.getElementById(`total${suffix}`).textContent = formatePrice(total);
  }
}

function getDeliveryFee() {
  const mobileChecked = document.getElementById('delivery').checked;
  const desktopChecked = document.getElementById('delivery-desktop').checked;
  return (mobileChecked || desktopChecked) ? 0 : deliveryFeeFixed;
}

function calculateSum() {
  return Object.values(basket).reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function minusOne(product) {
  if (basket[product]) {
    basket[product].quantity -= 1;
    if (basket[product].quantity <= 0) {
      delete basket[product];
    }
    renderBasket(); // aktualisiert den Warenkorb
  }
}

function plusOne(product) {
  if (basket[product]) {
    basket[product].quantity += 1;
    renderBasket(); // aktualisiert den Warenkorb
  }
}

function deleteCat(productName) {
  delete basket[productName];
  renderBasket();
}

function checkbox() {
  calculateAmounts();
}

function countItems() {
  const sum = Object.values(basket).reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById('items').innerText = sum;
  document.getElementById('items-desktop').innerText = sum;
}

function clearBasketUI(suffix, emptyText) {
  document.getElementById(`basket-content${suffix}`).innerHTML = emptyText;
  document.getElementById(`items${suffix}`).textContent = '0';
  document.getElementById(`subtotal${suffix}`).textContent = '0,00';
  document.getElementById(`service${suffix}`).textContent = '5,95';
  document.getElementById(`total${suffix}`).textContent = '0,00';
  document.getElementById(`reset${suffix}`).classList.add('d-none');
  document.getElementById(`send${suffix}`).classList.add('d-none');
  document.getElementById(`delivery${suffix}`).disabled = true;
  document.getElementById(`delivery${suffix}`).checked = false;
}

function resetBasket() {
  const emptyTexts = {
    '': '<div class="empty-basket">Dein Warenkorb ist leer.</div>',
    '-desktop': '<div class="empty-basket">Ihr Warenkorb ist leer.</div>'
  };

  for (const suffix in emptyTexts) {
    clearBasketUI(suffix, emptyTexts[suffix]);
    console.log(`Warenkorb ${suffix || 'mobile'} vollständig geleert.`);
  }
}

// === Sticky Warenkorb Toggle ===
let warenkorbOffen = false;

function toggleWarenkorb() {
  const warenkorb = document.getElementById("slideWarenkorb");
  const button = document.getElementById("toggleCartBtn");

  warenkorbOffen = !warenkorbOffen;

  if (warenkorbOffen) {
    warenkorb.classList.add("show");
    button.innerHTML = "🛒 Warenkorb verbergen";
  } else {
    warenkorb.classList.remove("show");
    button.innerHTML = "🛒 Warenkorb anzeigen";
  }
}

window.addEventListener('load', () => {
  if (window.innerWidth <= 1280) {
    document.getElementById("slideWarenkorb").classList.remove("show");
    warenkorbOffen = false;
  }
});

function calculateTotal() {
  let total = 0;
  for (let key in basket) {
    total += basket[key].price * basket[key].quantity;
  }

  const delivery = document.getElementById('deliveryCheckbox');
  if (delivery && delivery.checked === false) {
    total += 5.95; // Lieferkosten
  }

  return formatePrice(total);
}

function renderTotal() {
  const total = calculateTotal();
  document.getElementById("totalDisplay").innerText = formatePrice(total) + " €";
}

function formatePrice(num) {
  return num.toFixed(2).replace('.', ',');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('send')?.addEventListener('click', handleOrder);
  document.getElementById('send-desktop')?.addEventListener('click', handleOrder);
});

function handleOrder() {
  const isPickup = getPickupSelection();
  const subtotal = calculateSubtotal();
  const deliveryFee = 5.95;
  const total = isPickup ? subtotal : subtotal + deliveryFee;

  alert(createOrderMessage(subtotal, deliveryFee, total, isPickup));

  clearBasketAndForm();
  renderBasket();
}

function getPickupSelection() {
  const pickupMobile = document.getElementById('delivery');
  const pickupDesktop = document.getElementById('delivery-desktop');
  return (pickupMobile?.checked || pickupDesktop?.checked) || false;
}

function calculateSubtotal() {
  return Object.values(basket).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatePrice(value) {
  return value.toFixed(2).replace('.', ',');
}

function createOrderMessage(subtotal, deliveryFee, total, isPickup) {
  return `Vielen Dank für deine Bestellung!\n` +
         `Zwischensumme: ${formatePrice(subtotal)} €\n` +
         (isPickup ? `Selbstabholung: keine Lieferkosten\n`
                   : `Lieferkosten: ${formatePrice(deliveryFee)} €\n`) +
         `Gesamtbetrag: ${formatePrice(total)} €`;
}

function clearBasketAndForm() {
  basket = {};
  basketItems = [];
  const fields = ['delivery', 'delivery-desktop'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
}


function findDishByName(dishName) {
  for (const category in allDishes) {
    const dish = allDishes[category].find(d => d.name === dishName);
    if (dish) return dish;
  }
  return null;
}

function updateBasketWithDish(dishName, dish) {
  if (!basket[dishName]) {
    basket[dishName] = {
      quantity: 1,
      price: dish.price
    };
  } else {
    basket[dishName].quantity++;
  }
}

function addToBasket(dishName) {
  const dish = findDishByName(dishName);

  if (!dish) {
    console.warn('Gericht nicht gefunden:', dishName);
    return;
  }

  updateBasketWithDish(dishName, dish);
  renderBasket();
}

function removeFromBasket(dishName) {
  if (!basket[dishName]) return;

  basket[dishName].quantity--;

  if (basket[dishName].quantity <= 0) {
    delete basket[dishName];
  }

  renderBasket();
}

function resetBasket() {
  basket = {};
  renderBasket();
}