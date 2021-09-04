// const findFood = require("./scripts/script")

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
// function findFood(food){
  // let url = "https://api.edamam.com/api/nutrition-data?app_id=4f9d03e6&app_key=dff8c743ccd80a3db6f55d96a39188a1&nutrition-type=logging&ingr="
  //   url = url + food;
  //   let nutrition = {};
  //   fetch(url).then((res)=>res.json()).then((val)=>console.log(val.data));
  //   // return nutrition;
  // }
  
  
let url ="https://api.edamam.com/api/nutrition-data?app_id=4f9d03e6&app_key=dff8c743ccd80a3db6f55d96a39188a1&nutrition-type=logging&ingr=chicken"
fetch(url).then((response) => response.json()).then(data => console.log(data));

// fetchText()
// findFood("chicken")
console.log("ITS WORKING");