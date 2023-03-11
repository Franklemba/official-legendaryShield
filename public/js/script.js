

let bar = document.getElementById('bar');
let navbar = document.getElementById('navbar');
let overlay = document.querySelector('.overlay');
let searchBar = document.getElementById('searchBar');
let search = document.querySelector('.search');
let check = true

bar.addEventListener('click',()=>{
    navbar.classList.add('active');
    overlay.classList.add('active');
    search.classList.remove('active');
    check = true;
    // alert("kejnskvjk")
})

overlay.addEventListener('click',()=>{
    navbar.classList.remove('active');
    overlay.classList.remove('active');
    search.classList.remove('active');
    check = true;
})

// console.log("what the heck is going on here")

searchBar.addEventListener('click',()=>{
    if(check == true){
        search.classList.add('active');
        check = false;
    }else if(check == false){
        search.classList.remove('active');
        check = true;
    }
})



window.onscroll =() =>{
    navbar.classList.remove('active');
    overlay.classList.remove('active');
    search.classList.remove('active');
    check = true;
}