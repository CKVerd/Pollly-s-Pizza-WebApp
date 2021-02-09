function next() {
    var row = document.querySelector('.row-body');
    var row2 = document.querySelector('.row-body-2');
    row.classList.add('remove')
    row2.classList.add('appear')
}

function next2() {
    var row2 = document.querySelector('.row-body-2');
    var row3 = document.querySelector('.row-body-3');
    row2.classList.remove('appear')
    row2.classList.add('remove')
    row3.classList.add('appear')
}

function goLogin() {
    window.location.href = "login.html";
}
