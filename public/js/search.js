const LSproducts = [
    {
        "category": "jewery",
        "products":["necklaces","rings","bracelets"]
    },
    {
        "category":"watches",
        "products":["Mens Watch","Womens Watch","Unisex Watch","Classic Watch"]
    },
    {
        "category":"custom brands",
        "products":["wallets","flasks","phone pouches","diaries","special customization"]
    }
]


var inputBox = document.getElementById('itemSearched');
let searchWrapper = document.querySelector('.search-input');
let suggBox = searchWrapper.querySelector('.autocom-box');
let EnterSearch = document.getElementById('searchBarSubmit');


inputBox.onkeyup =(e) =>{
 
    let userData = e.target.value;
    let allProductsArray = [];



    LSproducts.forEach(LSproducts=>{
        LSproducts.products.forEach(product=>{
            allProductsArray.push(`${product}`);
        })
    })
    
 

    if(userData){
        allProductsArray = allProductsArray.filter((data)=>{
            return data.toLocaleUpperCase().includes(userData.toLocaleUpperCase().trimStart());
        })
        allProductsArray = allProductsArray.map((data)=>{
            return data = `<li>${data}</li>` 
        });
        suggBox.classList.add('active');
        showSuggestions(allProductsArray);

        let allList = suggBox.querySelectorAll("li");
            
                        for(let i = 0; i < allList.length; i++){
                            //adding onclick attribute in all li tags
                            allList[i].addEventListener('click', ()=>{
                                select(allList[i]);
                                userData = allList[i];
                            })
                            
                        }

                        function select(element){
                            let selectUserData = element.textContent;
                            inputBox.value = selectUserData; //passing the user selected list item data in textfield
                            console.log(selectUserData);
                        }

    }else{
        suggBox.classList.remove('active');
    }

    // console.log(userData)

}




let showSuggestions=(list)=>{
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}


EnterSearch.addEventListener('click', ()=>{
    // alert("it's working")
    let allProductsArray = [];



    LSproducts.forEach(LSproducts=>{
        LSproducts.products.forEach(product=>{
            allProductsArray.push(`${product}`);
        })
    })
    if(allProductsArray.includes(inputBox.value.trim()) == true){
        document.getElementById('submitForm').submit()   
    //    console.log(allProductsArray)
    }else{
        alert("such item is not available")
    }
    
})


