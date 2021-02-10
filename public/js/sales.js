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