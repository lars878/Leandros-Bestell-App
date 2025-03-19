let basket = {};

function render() {
  const categories = Object.keys(dishes);
  categories.forEach(category => {
    const categoryName = category;
    const categoryDiv = category + '-list';
    fillDiv(categoryName, categoryDiv);
  });
}

function fillDiv(catName, catDiv) {
  const dishGroup = document.getElementById(catDiv);
  // If dishGroup is null, do not attempt to set the innerHTML
  if (!dishGroup) {
    console.error(`Element with id '${catDiv}' not found.`); // Log an error message to the console
    return; // Exit the function early
  }
  let dishList = '';
  dishes[catName].forEach(dish => {
    let newEntry = dishTemplate(dish.name, dish.infos, dish.price);
    dishList += newEntry;
    });
  dishGroup.innerHTML = dishList;
}

function formatePrice(price) {
  let priceString = price.toFixed(2).toString().replace('.', ',');
  return priceString;
}

function addDish(productName, price) {
  if(basket[productName]) {
    basket[productName].quantity++;
  } else {
    basket[productName] = {quantity: 1, price};
  }
  renderBasket();
}

function renderBasket() {
  const basketContent = document.getElementById('basket-content');
  const content = Object.entries(basket);
  if(content.length > 0) {  
    basketContent.innerHTML = updateBasket(content);
    calculateAmounts();
    document.getElementById('reset').classList.remove('d-none');
    document.getElementById('send').classList.remove('d-none');
  } else {
    resetBasket();
  }
  countItems();
}

function updateBasket(contentArray) {  
  let basketItems = '';
  contentArray.forEach(([product, data]) => {
    const newEntry = basketItemTemplate(product, data.quantity, data.price);
    basketItems += newEntry;
    document.getElementById('delivery').disabled = false;
    });
  return basketItems;
}

function productSum(quantity, price) {
  const itemAmount = quantity * price;
  return itemAmount;
}

function minusOne(productName) {
  basket[productName].quantity--;
  if(basket[productName].quantity == 0) {
    deleteCat(productName);
  }
  renderBasket();
}

function plusOne(productName) {
  basket[productName].quantity++;
  renderBasket();
}

function deleteCat(productName) {
  delete basket[productName];
  renderBasket();
}

function calculateAmounts() {
  const showSubtotal = document.getElementById('subtotal');
  const showTotal = document.getElementById('total');
  let service = document.getElementById('service').innerHTML;
  const serviceFee = parseFloat(service.replace(',','.'));
  const sum = calculateSum();
  showSubtotal.innerText = formatePrice(sum);
  finalSum = sum + serviceFee;
  showTotal.innerText = formatePrice(finalSum);
}

function calculateSum() {
  let amount = 0;
  Object.values(basket).forEach(({quantity, price}) => {
    const subtotal = quantity * price;
    amount += subtotal;
  });
  return amount;
}

function checkbox() {
  const checkBox = document.getElementById('delivery');
  const service = document.getElementById('service');
  let deliveryFee = checkBox.checked ? 0 : 5.95;
  service.innerText = formatePrice(deliveryFee);
  calculateAmounts();
}

function countItems() {
  const items = document.getElementById('items');
  let sum = 0;
  Object.values(basket).forEach(value => {
    sum += value.quantity;
  });
  items.innerText = sum;
}

function resetBasket() {
  basket = {};
  document.getElementById('items').innerText = '0';
  document.getElementById('basket-content').innerHTML = "<span class='empty_basket'>Ihr Warenkorb ist wieder leer</span>";
  document.getElementById('delivery').disabled = true;
  document.getElementById('delivery').checked = false;
  document.getElementById('subtotal').innerText = '0,00';
  document.getElementById('service').innerText = '5,95';
  document.getElementById('total').innerText = '0,00';
  document.getElementById('reset').classList.add('d-none');
  document.getElementById('send').classList.add('d-none');
}