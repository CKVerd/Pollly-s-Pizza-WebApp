
function logout() {
    window.location.href = "login.html";
}

function showPopup() {
    var popup = document.querySelector('.popup');
    popup.classList.remove('make-invisible')
    popup.classList.add('make-visible')
}

function closePopup() {
    var popup = document.querySelector('.popup');
    popup.classList.remove('make-visible')
    popup.classList.add('make-invisible')
}


