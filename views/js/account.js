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
    var popup2 = document.querySelector('.change-pass-1');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
    popup2.classList.remove ('disappear')
    popup2.classList.add ('appear')
}

function closeChangePassPopup() {
    var popup = document.querySelector('.change-pass-popup');
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}

function showAddAccountPopup() {
    var popup = document.querySelector (".add-account-popup");
    var popup2 = document.querySelector('.add-account-div');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
    popup2.classList.remove('disappear');
    popup2.classList.add('appear');

}

function closeAddAccountPopup() {
    var popup = document.querySelector (".add-account-popup");
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}

function showDelete() {
    var popup = document.querySelector('.delete-popup');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
}

function closeDeletePopup() {
    var popup = document.querySelector (".delete-popup");
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}

function showConfirmPass() {
    var popup = document.querySelector('.confirm-popup');
    popup.classList.remove('make-invisible');
    popup.classList.add('make-visible');
}

function closeConfirmPopup() {
    var popup = document.querySelector (".confirm-popup");
    popup.classList.remove('make-visible');
    popup.classList.add('make-invisible');
}