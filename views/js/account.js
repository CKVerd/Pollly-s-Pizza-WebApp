function showChangeUsern() {
    var popup = document.querySelector('.change-usern-popup');
    popup.classList.remove('make-invisible')
    popup.classList.add('make-visible')
    var content = document.querySelector('.change-usern-1');
    var content2 = document.querySelector('.change-usern-2');
    content2.classList.remove('appear')
    content2.classList.add('disappear')
    content.classList.remove('remove')
    content.classList.add('appear')
}

function closeUsernPopup() {
    var popup = document.querySelector('.change-usern-popup');
    popup.classList.remove('make-visible')
    popup.classList.add('make-invisible')
}

function usernNext1() {
    var content = document.querySelector('.change-usern-1');
    var content2 = document.querySelector('.change-usern-2');
    content.classList.remove('appear')
    content.classList.add('remove')
    content2.classList.remove('remove')
    content2.classList.add('appear')
}