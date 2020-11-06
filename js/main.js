let navbar = document.querySelector('.side-navbar')
let burgerButton = document.querySelector('.burger-button')

burgerButton.onclick = function () {
  navbar.classList.toggle('main-header__side-navbar--open');
  console.log('Кнопка меню нажата');
};