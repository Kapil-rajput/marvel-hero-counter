var public_key = '6b1c5fd4b5f3d886916c8da88be893ce';
var private_key = 'bbda24093dc1248fc1d2215b529fcfcc6d345025';
var ts = Date.now();
var st = ts + private_key + public_key;

var hash = CryptoJS.MD5(st).toString();
console.log("hash : ", hash);
var h_url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${public_key}&hash=${hash}`;

// ...............................................................................................................................................................

let arr = [];


function homepage() {
    fetch(h_url) // fetching url
        .then(response => response.json()) // resolving promise
        .then(infos => {
            // console.log(data.data.results)
            homepage_hero(infos.data.results) // again resolving and getting data and calling homepagehero  fucntion
        });
} homepage();// calling itself


function homepage_hero(data) {
    let card_bucket = document.querySelector(".container"); // getting element

    for (let dat of data) { // loop for dispalying 20 elements at homepage
        let cardbox = document.createElement('div');
        cardbox.classList.add('card');
        arr.push(dat.id); // getting ids of character in array
        // console.log(dat);
        cardbox.innerHTML = // displaying content through java script
            `<img src="${dat.thumbnail.path + '.' + dat.thumbnail.extension}" alt="" class="card-img">
            <h3 class="card-heading">${dat.name}</h3>
            <div class="btns">
            <button type="submit" class="links" id="${dat.id}">More Details</button>
            <i class="fa-solid un-fav  fa-heart"></i>
            </div>
            <p class="char-id">ID:${dat.id}</p>`
        card_bucket.appendChild(cardbox);// appending to dispkay html through java script
    }
}
// '''''''''''''''''''''''''''

function removeall() { // fucntion to rempve all content on page
    let c = document.querySelectorAll(".card");
    // console.log(c);
    for (let i = 0; i < c.length; i++) { // loop to travel to all the cards to delete them all
        // console.log(c[i]);
        c[i].remove();
        arr = [];
    }
    let card_bucket = document.querySelector(".container");
    card_bucket.innerHTML = "";
}

// ..........................................................................................................................................

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let card_bcket = document.querySelector(".container"); // this function is also to delete all the contents on the page and then to display the more dtails of the superhero 
card_bcket.addEventListener('click', (e) => {
    if (e.target.classList.contains("links")) {
        removeall(); // this will remove all the contents from the page
        let c = e.target.getAttribute('id');
        superhero(c); // thiss will call the  fucntion of superheroe to display all the informatiuon of the current superhero


    }
})


function superhero(id) { // dfunction to display all the details of superhero
    // console.log(id);
    var s_url = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${public_key}&hash=${hash}`;
    fetch(s_url)
        .then(response => response.json())// promise resolving using then
        .then(infos => {
            // console.log(infos.data.results)
            superhero_details(infos.data.results);  // callling fucntion and paassing details
        });
}

let card_bucket = document.querySelector(".container")
function superhero_details(details) {
    // console.log(details[0].name);
    card_bucket.innerHTML = // container for display more details of the superhero
        `<div class="detail-card">
                <div class="uppernav">
                   <p>${details[0].name}</p>
                   <i class="fa-solid back fa-square-xmark"></i>
                </div>
                <div class="main-detail">
                    <img src="${details[0].thumbnail.path + '.' + details[0].thumbnail.extension}" class="det-img" alt="">
                    <div class="info">
                        <p id="description">${details[0].description}</p>
                        <ul>
                        <p>SERIES</p>
                        <li> ${details[0].series.items[0].name} </li>
                        <li>${details[0].series.items[1].name} </li>
                        </ul>
                        <ul>
                        <p>COMICS</p>
                        <li>${details[0].comics.items[0].name}</li>
                        <li> ${details[0].comics.items[1].name} </li>
                        </ul>
                        <ul>
                        <p> STORIES </p>
                        <li>${details[0].comics.items[1].name}</li>
                        <li>${details[0].comics.items[1].name}</li>
                    </div>
                </div>
            </div>`

    let back = document.querySelector(".back"); // fucntion to go back from that page
    back.addEventListener('click', function () {
        card_bucket.innerHTML = ""; // this will delete all the more detials of the superhero
        homepage(); // this will return to homepage so that when we click on back button it will show the homepage
    })
}




// .........................................................................................................................................................


// search function to control the search and display result when there are 3 charcters
let input = document.querySelector("#search");
let count = 0;
let text = 0;
input.addEventListener('keyup', function (e) {
    if (input.value.length >= 3) { // this will show the result after 3 charcter key are pressed
        search(input.value); // calling search function 
    }
    if (e.keyCode == 13) { // this will prevent default
        e.preventDefault();
    }


})

function search(search) {
    var s_url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&nameStartsWith=${search}&apikey=${public_key}&hash=${hash}`;
    fetch(s_url)
        .then(response => response.json())
        .then(search_data => {
            // console.log(search_data.data.results)
            //    console.log(search.length);
            removeall(); // when search start it will remove all homepage content and then it will only show the serach result
            homepage_hero(search_data.data.results);
            if (input.value == "") { // if input value is empty again then it will remove all the search result and show the homepage again
                removeall();
                homepage();
            }
        });
}

// MENU
let home = document.getElementById("homepage"); // adding functionality to p tags so that on clicking on that it will shwo hoempage
home.addEventListener("click", function () {
    // console.log("hi")
    removeall();
    homepage();
})



// ...................................................Favourite Section>..........................................................................................

function store() {
    let fav_bucket = document.querySelector(".container");
    fav_bucket.addEventListener('click', (e) => {
        if (e.target.classList.contains("un-fav")) {
            var cur = e.target;
            var prev = e.target.previousElementSibling;
            var key = prev.getAttribute('id');
            localStorage.setItem(key, key) // getting id as a key in local storage
            cur.classList.add("fav");
            cur.classList.remove("un-fav");
            // console.log(c, key);
        }
        else if (e.target.classList.contains("fav")) {
            var cur = e.target;
            var prev = e.target.previousElementSibling;
            var key = prev.getAttribute('id');
            localStorage.removeItem(key); // removing particular id form key from loal storage
            cur.classList.add("un-fav");
            cur.classList.remove("fav");
            // console.log(c, key);
        }
    })
}
store();

let fav_ids = [];
let favourite = document.getElementById("favourite");
favourite.addEventListener("click", function () {
    // console.log("hi")
    removeall();
    if (localStorage.length == 0) {
        let card_bucket = document.querySelector(".container");
        let ele = document.createElement("div");
        ele.innerHTML = //  if nothing is present in local storage then it will show no data found dailog box
            `<div class="message-box">
            <h1> No Data Found !!! </h1>
                <div class="message">
                <h3> Click on white heart icon to add superhero to ur favourite page and click on red heart to remove from favourite page :)</h3>
                </div>
                </div>`
        card_bucket.appendChild(ele);
    }
    // console.log(localStorage)
    else {
        favourite_page(localStorage); // if it is not empty then it wil pass the local storage to the favourite page function
    }
})

function favourite_page(value) {
    for (let i = 0; i < value.length; i++) {
        var keyss = localStorage.key(i);
        var fav_url = `https://gateway.marvel.com:443/v1/public/characters/${keyss}?ts=${ts}&apikey=${public_key}&hash=${hash}`;
        fetch(fav_url)
            .then(response => response.json())
            .then(infos => {
                // console.log(infos.data.results)
                fav_hero(infos.data.results);
            });
    }
}
function fav_hero(data) {
    let card_bucket = document.querySelector(".container");
    for (let dat of data) {
        let cardbox = document.createElement('div');
        cardbox.classList.add('card');
        // console.log(dat);
        cardbox.innerHTML = // it will show the cards at favoruite page with all red heart
            ` 
            <img src="${dat.thumbnail.path + '.' + dat.thumbnail.extension}" alt="" class="card-img">
                <h3 class="card-heading">${dat.name}</h3>
                <div class="btns">
                <button type="submit" class="links" id="${dat.id}">More Details</button>
                <i class="fa-solid fav fa-heart"></i>
                </div>
                <p class="char-id">ID:${dat.id}</p>
                `
        card_bucket.appendChild(cardbox);
    }

}





