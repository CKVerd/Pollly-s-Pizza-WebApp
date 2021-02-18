var clicks = 0;

function addClick() {
    var item = document.getElementById('item-quantity');
    var text = item.textContent;
    var out = parseInt(text);
    out++;
    item.innerHTML = out;
    console.log(out);
}

function removeClick() {
    var item = document.getElementById('item-quantity');
    var text = item.textContent;
    var out = parseInt(text);
    out--;
    item.innerHTML = out;
    console.log(out);
}

function showAddProductPopup() {
    var popup = document.querySelector('.add-product-popup');
    var popup2 = document.querySelector('.add-product-popup-form');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
    popup2.classList.remove ('disappear')
    popup2.classList.add ('appear')
}

function closeAddProductPopup() {
    var popup = document.querySelector('.add-product-popup');
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}
