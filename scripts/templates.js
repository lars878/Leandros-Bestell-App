function productSum(quantity, price) {
  return quantity * price;
}

function dishTemplate(title, description, price, category) {
  return `
    <div class="dish_template">
      <div>
        <p>${title}</p>
        <p>${description}</p>
        <p>${formatePrice(price)} Euro</p>
      </div>
      <div class="icon_frame">
        <img src="./icons_images/add.svg" class="icon" onclick="addDish('${title}', ${price})">
      </div>
    </div>
  `;
}

function basketItemTemplate(product, quantity, price) {
  return `
    <div class="item_template">
      <p>${product}</p>
      <div class="item_menu">
        <div class="item_controls">
          <div class="icon_frame">
            <img src="./icons_images/minus.svg" class="basket_icon" onclick="minusOne('${product}')">
          </div>
          <p>${quantity}</p>
          <div class="icon_frame">
            <img src="./icons_images/plus.svg" class="basket_icon" onclick="plusOne('${product}')">
          </div>
        </div>
        <div class="item_price_block">
          <p>${formatePrice(productSum(quantity, price))} Euro</p>
          <div class="icon_frame">
            <img src="./icons_images/trash.svg" class="basket_icon" onclick="deleteCat('${product}')">
          </div>
        </div>
      </div>
    </div>
  `;
}