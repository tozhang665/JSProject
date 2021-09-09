// const findFood = require("./scripts/script")
//https://api.edamam.com/api/food-database/v2/parser?app_id=81004352&app_key=4525ccc584ab8228a8038d8fddfa8b28&ingr=eggs%20and%20bacon&nutrition-type=cooking

const draggables = document.querySelectorAll(".draggable")
const containers = document.querySelectorAll(".container")

draggables.forEach(draggable =>{
  draggable.addEventListener('dragstart',()=>{
    draggable.classList.add('dragging');
  })

  draggable.addEventListener('dragend',()=>{
    draggable.classList.remove('dragging');
  })

})

containers.forEach(container =>{
  container.addEventListener('dragover',e=>{
    e.preventDefault();
    const afterElement = getDragAfterElement(container,e.clientY)
    const draggable = document.querySelector(".dragging")
    if(afterElement == null){
      container.appendChild(draggable);
    }else{
      container.insertBefore(draggable,afterElement.element);
    }

  })

})


function getDragAfterElement(container,y){
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging')]

  return draggableElements.reduce((closest,child)=>{
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    // console.log(offset);
    if(offset < 0 && offset > closest.offset){
      return {offset:offset,element:child}
    }else{
      return closest
      // return {offset:offset,element:child}
    }
  },{offset: Number.NEGATIVE_INFINITY})

}

function grabDivFoods(elementID){
  var terms = [];
  var children = [].slice.call(document.getElementById(elementID).getElementsByTagName('*'),0);

  var elements = new Array(children.length);
  var arrayLength = children.length;
  for (var i = 0; i < arrayLength; i++) {
    var name = children[i].getAttribute("id");   
    elements[i]=name;
  }
  
  elements.forEach((ele,idx)=>{
    if(idx%2 ===1){
      terms.push(ele)
    }
  })
  return terms;
}
function grabFoods(){


  terms = grabDivFoods('leftSide-1');
  terms = terms.concat(grabDivFoods('leftSide-2'));
  terms = terms.concat(grabDivFoods('rightSide-1'));
  terms = terms.concat(grabDivFoods('rightSide-2'));
  terms = terms.concat(grabDivFoods('rightSide-3'));
  terms = terms.concat(grabDivFoods('rightSide-4'));
  // console.log(terms)
  return terms.join("%20and%20");
}


function addItem(){
  let food = document.getElementById("food-input").value
  console.log(food)



  let url = "https://api.edamam.com/api/food-database/v2/parser?app_id=81004352&app_key=4525ccc584ab8228a8038d8fddfa8b28&ingr="
  url = url+ food + "&nutrition-type=cooking"

  fetch(url)
  .then((res)=>res.json())
  .then((data)=>{
    if(data["parsed"].length !== 0){



      let cont = document.getElementById("foods-lists");
      let newFood = document.createElement("li");
      newFood.setAttribute("class","draggable");
      newFood.setAttribute("draggable","true");
      newFood.innerHTML=`<h1 class="food" id="${food}"></h1><p>${food}</p>`;
      // newFood.style.backgroundimage="url('../../dist/food/StockPics/cannedFood.png')"
      console.log(newFood);
      cont.insertBefore(newFood,cont.firstChild)
      // cont.appendChild(newFood);
      console.log(cont);
      newFood.addEventListener('dragstart',()=>{
        newFood.classList.add('dragging');
      })
      newFood.addEventListener('dragend',()=>{
        newFood.classList.remove('dragging');
      })
    }
  })
}

function cap(word){
  return word.charAt(0).toUpperCase()+ word.slice(1);
}

function updatePicked(){
  let terms = grabFoods().split("%20and%20");
  // console.log(terms)
  for(let i = 0; i < terms.length;i++){
    terms[i] = cap(terms[i]);
  }
  // console.log(terms)
  let list = document.getElementById("picked-foods");
  let servings = document.getElementById("serving-size");
  // console.log(list);
  // console.log(list.innerText.indexOf("Rice"))
  // console.log(list.innerText.indexOf("Hotdog"))
  // console.log(list.innerText.indexOf("chicken"))
  terms.forEach((ele)=>{
    if(!(list.innerText.indexOf(ele)>=0)){
      let food = document.createElement("h3");
      food.setAttribute("id",`${ele}-item`)
      food.innerText=`${ele}`
      list.appendChild(food);

      let serving = document.createElement("input")
      serving.setAttribute("type","text");
      serving.setAttribute("id",`${ele}-serving`);
      serving.value = 100;
      servings.appendChild(serving);
    }
  })

  var children = [].slice.call(document.getElementById("picked-foods").getElementsByTagName('*'),0);
  var allFoods = new Array(children.length);
  var arrayLength = children.length;

  for (var i = 0; i < arrayLength; i++) {
    var name = children[i].innerText;   
    allFoods[i]=name;
  }

  allFoods.forEach((ele)=>{
    if(terms.indexOf(ele)===-1){
      let item = document.getElementById(`${ele}-item`);
      let serv = document.getElementById(`${ele}-serving`);
      item.parentNode.removeChild(item);
      serv.parentNode.removeChild(serv);
    }
  })
}

async function getFoodAsync(name) 
{
  const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=81004352&app_key=4525ccc584ab8228a8038d8fddfa8b28&ingr=${name}&nutrition-type=cooking`);
  if(!response.ok){
    throw new Error('There are no items in the LunchBox');
  }
  const data = await response.json()
  return data;
}



function parseServings(myChart){

  var children = [].slice.call(document.getElementById("serving-size").getElementsByTagName('*'),0);
  var allServings = new Array(children.length);
  var arrayLength = children.length;
  for (var i = 0; i < arrayLength; i++) {
    var name = children[i].value;   
    allServings[i]=name;
  }



  var children2 = [].slice.call(document.getElementById("picked-foods").getElementsByTagName('*'),0);
  var allFoods = new Array(children2.length);
  var array2Length = children2.length;

  for (var i = 0; i < array2Length; i++) {
    var name = children2[i].innerText;   
    allFoods[i]=name;
  }


  let carbs = 0;
  let fats = 0;
  let protein = 0;
  let calories = 0;

  let strAllFoods = allFoods.join("%20")


  // const baseURL=`https://api.edamam.com/api/food-database/v2/parser?app_id=81004352&app_key=4525ccc584ab8228a8038d8fddfa8b28&ingr=${strAllFoods}&nutrition-type=cooking`
  // fetch(baseURL)
  getFoodAsync(strAllFoods)
    .then((data)=>{
      // console.log("FETCHING")
      let foodItems = data["parsed"];
      // console.log(data["parsed"])

      foodItems.forEach((ele,idx)=>{
        let grabbedCal = ele["food"]["nutrients"]["ENERC_KCAL"];
        let grabbedCarb = ele["food"]["nutrients"]["CHOCDF"];
        let grabbedProt = ele["food"]["nutrients"]["PROCNT"];
        let grabbedFat = ele["food"]["nutrients"]["FAT"];

        grabbedCal = (grabbedCal/100) * parseInt(allServings[idx]);
        grabbedCarb = (grabbedCarb/100) * parseInt(allServings[idx]);
        grabbedProt = (grabbedProt/100) * parseInt(allServings[idx]);
        grabbedFat = (grabbedFat/100) * parseInt(allServings[idx]);

        carbs += grabbedCarb;
        fats += grabbedFat;
        protein += grabbedProt;
        calories +=grabbedCal
      })
      calories = calories.toFixed(0)
      myChart["data"]["datasets"]["0"]["label"] = `Total Calories: ${calories}`
      myChart["data"]["datasets"]["0"]["data"] = [carbs, fats, protein];
      myChart.update(); 
    })

}



document.getElementById("checkbox").addEventListener("change", function(){
	//This input has changed
   console.log('This Value is', this.checked);
   if(this.checked === true){
    //  myChart["config"]["options"]["scales"]["yAxes"][0]["gridlines"]["drawBorder"]= false;
     myChart["config"]["type"] = 'pie'
     
   }else{
     myChart["config"]["type"] = 'bar'
    //  myChart["config"]["options"]["scales"]["yAxes"][0]["gridlines"]["drawBorder"]= true;
   }

   myChart.update();
});