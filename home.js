var public_key = '6b1c5fd4b5f3d886916c8da88be893ce';
var private_key = 'bbda24093dc1248fc1d2215b529fcfcc6d345025';
var ts = Date.now();
var st = ts + private_key + public_key;

var hash = CryptoJS.MD5(st).toString();
console.log("hash : ", hash);
var h_url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${public_key}&hash=${hash}`;

// ...............................................................................................................................................................

let arr = [];
let fav_arr = [];


function homepage() {
    fetch(h_url)
        .then(response => response.json())
        .then(infos => {
            // console.log(data.data.results)
            homepage_hero(infos.data.results)
        });
} homepage();


function homepage_hero(data) {
    let card_bucket = document.querySelector(".container");

    for (let dat of data) {
        let cardbox = document.createElement('div');
        cardbox.classList.add('card');
        arr.push(dat.id);
        // console.log(dat);
        cardbox.innerHTML =
            `<img src="${dat.thumbnail.path + '.' + dat.thumbnail.extension}" alt="" class="card-img">
            <h3 class="card-heading">${dat.name}</h3>
            <div class="btns">
            <button type="submit" class="links" id="${dat.id}">More Details</button>
            <i class="fa-solid un-fav  fa-heart"></i>
            </div>
            <p class="char-id">ID:${dat.id}</p>`
        card_bucket.appendChild(cardbox);
    }
}
// '''''''''''''''''''''''''''

function removeall() {
    let c = document.querySelectorAll(".card");
    // console.log(c);
    for (let i = 0; i < c.length; i++) {
        // console.log(c[i]);
        c[i].remove();
        arr = [];
    }
    let card_bucket = document.querySelector(".container");
    card_bucket.innerHTML = "";
}

// ..........................................................................................................................................

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let card_bcket = document.querySelector(".container");
card_bcket.addEventListener('click', (e) => {
    if (e.target.classList.contains("links")) {
        removeall();
        let c = e.target.getAttribute('id');
        superhero(c);


    }
})


function superhero(id) {
    // console.log(id);
    var s_url = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${public_key}&hash=${hash}`;
    fetch(s_url)
        .then(response => response.json())
        .then(infos => {
            // console.log(infos.data.results)
            superhero_details(infos.data.results);
        });
}

let card_bucket = document.querySelector(".container")
function superhero_details(details) {
    // console.log(details[0].name);
    card_bucket.innerHTML =
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

    let back = document.querySelector(".back");
    back.addEventListener('click', function () {
        card_bucket.innerHTML = "";
        homepage();
    })
}




// .........................................................................................................................................................



let input = document.querySelector("#search");
let count = 0;
let text = 0;
input.addEventListener('keyup', function (e) {
    if (input.value.length >= 3) {
        search(input.value);
    }
    if (e.keyCode == 13) {
        e.preventDefault();
    }


})

function search(search) {
    var s_url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&nameStartsWith=${search}&apikey=${public_key}&hash=${hash}`;
    fetch(s_url)
    fetch(s_url)
        .then(response => response.json())
        .then(search_data => {
            // console.log(search_data.data.results)
            //    console.log(search.length);
            removeall();
            homepage_hero(search_data.data.results);
            if (input.value == "") {
                removeall();
                homepage();
            }
        });
}

// MENU
let home = document.getElementById("homepage");
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
            localStorage.setItem(key, key)
            cur.classList.add("fav");
            cur.classList.remove("un-fav");
            // console.log(c, key);
        }
        else if (e.target.classList.contains("fav")) {
            var cur = e.target;
            var prev = e.target.previousElementSibling;
            var key = prev.getAttribute('id');
            localStorage.removeItem(key);
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
        ele.innerHTML =
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
        favourite_page(localStorage);
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
        cardbox.innerHTML =
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





