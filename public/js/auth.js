const form = document.getElementById('authForm');

const password = document.getElementById('password')
const userName = document.getElementById('name')
const errorField = document.getElementById('errorField')

form.addEventListener('submit', (event) => {

  if (!userName.value) {
    userName.classList.add('incomplete')
    errorField.innerText = "Kindly fill in all fields"
    event.preventDefault();
  }
  if(!password.value){
    password.classList.add('incomplete')
    errorField.innerText = "Kindly fill in all fields"
    event.preventDefault();

  }
  setTimeout(()=>{
    errorField.innerText = ''
    userName.classList.remove('incomplete');
    password.classList.remove('incomplete');
  }, 3500)
});