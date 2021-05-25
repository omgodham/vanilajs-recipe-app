const RandomMealsContainer = document.querySelector(".random-meals-container");
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const favBtn = document.getElementsByClassName("fas");
const MealsListContainer = document.querySelector(".meals-list");
const detaileRecipeContainer = document.querySelector(".detail-recipe-container");

//get meals by name
async function getMealsByName(term) {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const meals = await response.json();
  // console.log(meals);
  return meals.meals;
}

//get meal data by id
async function getMealById(id) {
  const response = await (
    await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
  ).json();
  const meal = response.meals[0];
  return meal;
}

//get Random Meal data
async function getRandomMeal() {
  const response = await (
    await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
  ).json();
  const meal = response.meals[0];
  console.log(meal);
  setRandomMeal(meal, true);
  return meal;
}

// call get random meal initially
setFavMealsOnDom();

//calling four times to get initially four items on screen
getRandomMeal();
getRandomMeal();
getRandomMeal();
getRandomMeal();

//set random meal to DOM
function setRandomMeal(randomMealData, isRecipeOfDay) {
  const randomMeal = document.createElement("div");
  randomMeal.classList.add("random-meal");
  randomMeal.innerHTML = `
    <div class="random-meal-header" style="background-image:url('${
      randomMealData.strMealThumb
    }')" >
         ${isRecipeOfDay ? "<span>You May Like</span>" : ""}
    </div>
    <div class="random-meal-des">
        <h4>${randomMealData.strMeal}</h4>
        <i class="fas fa-heart" onclick="onFavBtn(${
          randomMealData.idMeal
        })"></i>
    </div>
    `;
  RandomMealsContainer.appendChild(randomMeal);
  randomMeal.addEventListener("click" , () => showDetailInfo(randomMealData));      
}

//set meals after search in DOM
async function setMealsAfterSearch() {
  const term = searchBar.value;
  const mealsAfterSearch = await getMealsByName(term);
  mealsAfterSearch.map((meal) => {
    setRandomMeal(meal, false);
  });
}

//onclicking on the search btn
searchBtn.addEventListener("click", () => onSearch());

//on search 
function onSearch(){
  RandomMealsContainer.innerHTML = "";
  setMealsAfterSearch();
  getRandomMeal();
  searchBar.value = "";
}

//search after pressing enter
searchBar.addEventListener('keyup' , (e) => {
 if(e.code === 'Enter'){
  onSearch();
 }
});

//set meals to LS
function addMealsToLs(idMeal) {
  const favMeals = getMealsFromLs();
  localStorage.setItem("fav-meals", JSON.stringify([...favMeals, idMeal]));
}

//get meals from LS
function getMealsFromLs() {
  const favMeals = JSON.parse(localStorage.getItem("fav-meals"));
  return favMeals === null ? [] : favMeals;
}

//on fav btn click
function onFavBtn(idMeal) {
  favBtn[1].style.color = "red";
  addMealsToLs(idMeal);
  setFavMealsOnDom();
}

//set fav-meals on dom
async function setFavMealsOnDom() {
  const favMealsIds = getMealsFromLs();
  MealsListContainer.innerHTML = '';
  if(favMealsIds.length){
    for (let i = 0; i < favMealsIds.length; i++) {
      const favMeal = document.createElement("li");
       const meal = await getMealById(favMealsIds[i]);
       favMeal.addEventListener("click" , () => showDetailInfo(meal));
       favMeal.innerHTML = `
           <img src='${meal.strMealThumb}' alt='${meal.strMeal}'><span>${meal.strMeal}</span>
          `;
          MealsListContainer.appendChild(favMeal);
}
  }      
  else{
    console.log("else");
    const favMeal = document.createElement("li");
    favMeal.style.fontWeight = '500'
    favMeal.innerText = `
    No favourite meals , add to see them here
  `
    MealsListContainer.appendChild(favMeal);
  }
  
}

//show detail info
function showDetailInfo(randomMealData){
    const detailRecipe = document.createElement('div');
    detailRecipe.classList.add('detail-recipe');
    detaileRecipeContainer.innerHTML = ``;
    detailRecipe.innerHTML = `
    <h3>${randomMealData.strMeal}</h3>
        <img src='${randomMealData.strMealThumb}'>
            <p class='detail-description'>${randomMealData.strInstructions}</p>
            <div class='ingredients'><span style="font-weight:500 ;  margin-bottom:20px">Ingredients:</span>
            ${setIngredients(randomMealData).map((ingredient,index) => {
              return `<p style="font-weight:500">${index+1 +". "+ ingredient}</p>`
            })}
            </div>
         <i class="fas fa-times" id="close-btn" onclick="closePopup()"></i>  
    `
    detaileRecipeContainer.appendChild(detailRecipe);
    detaileRecipeContainer.style.display = "flex";
}

function setIngredients(randomMealData){
  const Ingredients = [];
  for(let i=1;i < 20 ;i++){
    if( randomMealData['strIngredient' + i] !== "")
   {   
      const ingredient = `${randomMealData['strIngredient' + i]} / ${randomMealData['strMeasure' + i]}`;
    Ingredients.push(ingredient);
  }else break;

  }
  console.log(Ingredients);
return Ingredients;
}


function closePopup(){
    detaileRecipeContainer.style.display = "none";
}

