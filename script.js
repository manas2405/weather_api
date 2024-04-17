const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm= document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer= document.querySelector(".user-info-container")


// intially needed variables
let currentTab = userTab;
const API_KEY ="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab")
getfromSessionStorage();

 function switchTab(clickedTab){
    if(clickedTab!==currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            //search form wla container is ivisible, then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main phle search wle pe tha ab youer weather visible krna hoga
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab weather display hoga kyuki main your weather pe hun, so lets loscal storage first
            //for coordinates if we have saved them there
            getfromSessionStorage();
        }
    }
 }
userTab.addEventListener("click", ()=>{
    //pass clicked tab asinput 
    switchTab(userTab);
});
searchTab.addEventListener("click", ()=>{
    //pass clicked tab asinput 
    switchTab(searchTab);
});
//check if cordinates present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
        if(!localCoordinates){
        // not present 
       grantAccessContainer.classList.add("active");
       
        }
        else{
            const coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    // const city = coordinates;
    // make grantConatiner Visible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    // API call
    try{
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
loadingScreen.classList.remove("active");


    }
}
function  renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity =document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    //fetch value from  weather info object and pull it out
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all}%`; 

}
 function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // show alert for no geoloaction
        alert("nooo geolocation");
    }
 }
 function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
 }

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput =document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
 e.preventDefault();
 let cityName = searchInput.value;
    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
    //   document.innerHTML = "wrong input";
    // alert("wrong input");
    console.log("wrong" ,err);

    }

}




























// console.log('new new')

// const API_KEY ="d1845658f92b31c64bd94f06f7188c9c";

// async function showWeather(){
//     let city = 'bathinda';
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//    const data = await response.json();
//    console.log('Weather data -> ',data); 
//    let newPara = document.createElement('p');
//    newPara.textContent= `${data?.main?.temp.toFixed(2)} °C `
//    document.body.appendChild(newPara);
// }
// showWeather();