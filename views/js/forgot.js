function next() {
    var row = document.querySelector('.row-body');
    var row2 = document.querySelector('.row-body-2');
    row.classList.add('remove')
    row2.classList.add('appear')
}

function closePopup() {
    var popup = document.querySelector('.popup');
    popup.classList.remove('make-visible')
    popup.classList.add('make-invisible')
}