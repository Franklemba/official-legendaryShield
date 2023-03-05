let modalClose = document.querySelector('.modal-bg');

// let AppleCategory = [
//     {
//         categoryName: "Mac",
//         models : [
//             "Macbook Pro","Macbook Air"
//         ]
//     },
//     {
//         categoryName: "iPhone",
//         models : [
//             "4 series","5 series","6 series","7 series",
//             "8 series","X series","SE series","11 series","12 series",
//             "13 series","14 series"
//         ]
//     },
//     {
//         categoryName:"Watch",
//         models : [
//             "ultra","SE","series 8","series 7","series 6",
//             "series 5","series 4","series 3","series 2",
//             "series 1"
//         ]
//     },
//     {
//         categoryName: "iPad",
//         models : [
//             "regular","mini","Air","Pro"
//         ]
//     },
//     {
//         categoryName: "Airpods",
//         models : [
//             "2nd generation","3rd generation","Pro","max"
//         ]
//     },
//     {
//         categoryName: "Accessories",
//         models : [
//             "Power Adapters","USB - C","MagSafe charger","iPhone 6 case","iPhone 7 case",
//             "iPhone 8 case","iPhone X case","iPhone 11 case","ordinary iPhone charger"
//         ]
//     }
// ]

let productDetails = document.querySelectorAll('.category')

productDetails.forEach(data =>{
    data.addEventListener('click',(e)=>{
         
        const categoryName = e.target.textContent;
        console.log(categoryName);
        displayModal(categoryName);
    })
})


modalClose.addEventListener('click',()=>{
    document.querySelector('.modal').classList.remove('active');
    modalClose.classList.remove('active');
    // alert('dimensions');
})

// let displayModal = (category) =>{
//     document.querySelector('.modal').classList.add('active');
//     modalClose.classList.add('active');
//     document.querySelector('.modal h2').textContent = `${category}`;
//     document.querySelector('.modal ul').innerHTML = ``;
//     AppleCategory.forEach(data=>{
//         console.log(data.categoryName)
//         if(category == data.categoryName){
//             data.models.forEach(data=>{
//                 console.log(data);
//                 document.querySelector('.modal ul').innerHTML += `<li><a href = "/shop/${category}-${data}">${data}</a></li>`;
//             })
//         }
        
//     })
// }



