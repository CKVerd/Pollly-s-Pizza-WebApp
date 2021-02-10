function showChangeUsern() {
    var popup = document.querySelector('.change-usern-popup');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
    var content = document.querySelector('.change-usern-1');
    var content2 = document.querySelector('.change-usern-2');
    content2.classList.remove('appear');
    content2.classList.add('disappear');
    content.classList.remove('remove');
    content.classList.add('appear');
}

function closeUsernPopup() {
    var popup = document.querySelector('.change-usern-popup');
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}

function usernNext1() {
    var content = document.querySelector('.change-usern-1');
    var content2 = document.querySelector('.change-usern-2');
    content.classList.remove('appear');
    content.classList.add('remove');
    content2.classList.remove('remove');
    content2.classList.add('appear');
}

function showChangePass() {
    var popup = document.querySelector('.change-pass-popup');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
}

function closeChangePassPopup() {
    var popup = document.querySelector('.change-pass-popup');
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}

function showAddAccountPopup() {
    var popup = document.querySelector (".add-account-popup");
    var popup = document.querySelector (".add-account-popup");
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
}

function closeAddAccountPopup() {
    var popup = document.querySelector (".add-account-popup");
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}