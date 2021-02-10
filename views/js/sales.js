var clicks = 0;

function addClick() {
    clicks++;
    var item = document.getElementById('item-quantity');
    item.innerHTML('item');
    console.log(clicks);
}