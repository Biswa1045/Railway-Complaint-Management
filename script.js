const loregBox = document.querySelector('.loreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');


registerLink.addEventListener('click', ()=>{
    loregBox.classList.add('active');
});

loginLink.addEventListener('click', ()=>{
    loregBox.classList.remove('active');
})