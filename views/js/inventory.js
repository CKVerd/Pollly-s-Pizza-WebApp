function showAddPopup() {
    var popup = document.querySelector('.add-stock-popup');
    var popup2 = document.querySelector('.add-stock-popup-form');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
    popup2.classList.remove ('disappear')
    popup2.classList.add ('appear')
}

function closeAddStockPopup() {
    var popup = document.querySelector('.add-stock-popup');
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}

function showEditPopup(){
    var popup = document.querySelector('.edit-stock-popup');
    var popup2 = document.querySelector('.edit-stock-popup-form');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
    popup2.classList.remove ('disappear')
    popup2.classList.add ('appear')
}

function closeEditStockPopup() {
    var popup = document.querySelector('.edit-stock-popup');
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}