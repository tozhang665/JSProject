const KEYS = ["FAT","CHOCDF","PROCNT","ENERC_KCAL"]

function findFood(){
  const url = "https://api.edamam.com/api/nutrition-data?app_id=4f9d03e6&app_key=dff8c743ccd80a3db6f55d96a39188a1&nutrition-type=logging&ingr=chicken"

  function fetch(){
    fetch(url);
  }
}

module.exports = findFood;