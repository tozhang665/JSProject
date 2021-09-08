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
      // container.appendChild(draggable);
    }
    // getNutritionInfo();
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

function getNutritionInfo(){
  let rSide = document.getElementById("nutr-right-side")
  let canv = document.getElementById("myCanvas");
  canv.parentNode.removeChild(canv);

  let newCanv = document.createElement("canvas")
  newCanv.id = "myCanvas"
  rSide.appendChild(newCanv);
    let url2 = "https://api.edamam.com/api/food-database/v2/parser?app_id=81004352&app_key=4525ccc584ab8228a8038d8fddfa8b28&ingr=eggs%20and%20rice&nutrition-type=cooking"
    // let url ="https://api.edamam.com/api/nutrition-data?app_id=4f9d03e6&app_key=dff8c743ccd80a3db6f55d96a39188a1&nutrition-type=logging&ingr=chicken"
    fetch(url2)
      .then((response) => response.json())
      .then(data => {
        let foodCont = document.getElementById("nutr-left-side")

        let parsedData = data["parsed"]
        let extracted =[]
        let carbs = 0;
        let fats = 0;
        let protein = 0;
        let calories = 0;


        parsedData.forEach((ele)=>{
          let arr = [];
          // arr.push(ele["food"]["label"]);

          let food = document.createElement("h3")
          food.innerText = ele["food"]["label"];
          // detectedFoods.push(ele["food"]["label"]);
          foodCont.appendChild(food);

          arr.push(ele["food"]["nutrients"])
          extracted.push(arr)


          carbs = carbs + ele["food"]["nutrients"]["CHOCDF"];
          fats = fats + ele["food"]["nutrients"]["FAT"];
          protein = protein + ele["food"]["nutrients"]["PROCNT"];
          calories = calories + ele["food"]["nutrients"]["ENERC_KCAL"];
          
        })


        const labels =[
          'Carbohydrates',
          'Fats',
          'Proteins',
          'Calories'
        ];

        const data2 ={
          labels:labels,
          datasets:[{
            label:"Nutriton Facts",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [carbs,fats,protein,calories],
          }]
        };

        const config={
          type:'bar',
          data:data2,
          options:{}
        };

        var myChart = new Chart(
          document.getElementById('myCanvas'),
          config
        );
        console.log(extracted)
    });
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
  console.log(terms)
  return terms.join("%20and%20");
}

function updateChart(myChart){
  let url = "https://api.edamam.com/api/food-database/v2/parser?app_id=81004352&app_key=4525ccc584ab8228a8038d8fddfa8b28&ingr="
  let terms = grabFoods();
  url = url+ terms + "&nutrition-type=cooking"
  // let url2="https://api.edamam.com/api/food-database/v2/parser?app_id=81004352&app_key=4525ccc584ab8228a8038d8fddfa8b28&ingr=bacon&nutrition-type=cooking"
  fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let foodCont = document.getElementById("picked-foods")
        foodCont.innerHTML = "";
        // console.log(data)
        let parsedData = data["parsed"]
        // console.log(parsedData)
        let extracted = []
        let carbs = 0;
        let fats = 0;
        let protein = 0;
        let calories = 0;


        parsedData.forEach((ele) => {
          // console.log(ele);
          let weight = 1;
          console.log(ele)
          if(ele["food"]["servingsPerContainer"]){
            weight = ele["food"]["servingsPerContainer"];
          }
          console.log(weight);
          // console.log(weight);
          let arr = [];
          // arr.push(ele["food"]["label"]);

          let food = document.createElement("h3")
          food.innerText = ele["food"]["label"];
          // detectedFoods.push(ele["food"]["label"]);
          foodCont.appendChild(food);

          arr.push(ele["food"]["nutrients"])
          extracted.push(arr)

          carbs = carbs + (ele["food"]["nutrients"]["CHOCDF"]/weight);
          fats = fats + (ele["food"]["nutrients"]["FAT"]/weight);
          protein = protein + (ele["food"]["nutrients"]["PROCNT"]/weight);
          calories = calories + (ele["food"]["nutrients"]["ENERC_KCAL"]/weight);
        })
        // console.log(myChart);
        // console.log(myChart["data"]["datasets"]["0"]["data"]);
        myChart["data"]["datasets"]["0"]["label"] = `Total Calories: ${calories}`
        myChart["data"]["datasets"]["0"]["data"] = [carbs, fats, protein];
        // console.log(myChart.data.datasets.data);
        myChart.update();
      })
    
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

