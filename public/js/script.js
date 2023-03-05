

let bar = document.getElementById('bar');
let navbar = document.getElementById('navbar');
let overlay = document.querySelector('.overlay');


bar.addEventListener('click',()=>{
    navbar.classList.add('active');
    overlay.classList.add('active');
    // alert("kejnskvjk")
})

overlay.addEventListener('click',()=>{
    navbar.classList.remove('active');
    overlay.classList.remove('active');
})

// console.log("what the heck is going on here")

window.onscroll =() =>{
    navbar.classList.remove('active');
    overlay.classList.remove('active');
}