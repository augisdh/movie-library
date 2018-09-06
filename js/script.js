"use strict";

const navBtns = document.querySelectorAll(".btn-hero");
const sortBtns = document.querySelectorAll(".btn-sort");
const tableBody = document.querySelector(".list-info");
const loader = document.querySelector(".loading");

let obj;
let activeNavBtn = JSON.parse(sessionStorage.getItem("activeHero")) || 'batman';
let activeSortBtn = JSON.parse(sessionStorage.getItem("activeSort")) || 'date-up';

navBtns.forEach(btnHero => btnHero.addEventListener("click", () => {
    activeNavBtn = btnHero.dataset.hero;

    sessionStorage.setItem("activeHero", JSON.stringify(activeNavBtn));
    
    addRemoveClass();
    loadJson();
}));

sortBtns.forEach(btnSort => btnSort.addEventListener("click", () => {
    activeSortBtn = btnSort.dataset.sort;

    sessionStorage.setItem("activeSort", JSON.stringify(activeSortBtn));

    addRemoveClass();

    if(activeSortBtn === "date-up" || activeSortBtn === "date-down"){
        sortByDate(obj);
    } else if(activeSortBtn === "title-up" || activeSortBtn === "title-down"){
        sortByTitle(obj);
    }

    appendToHtml(obj);
}));

function addRemoveClass(){
    for(let i = 0; i < navBtns.length; i++){
        (activeNavBtn === navBtns[i].dataset.hero) ? navBtns[i].classList.add("active") : navBtns[i].classList.remove("active");
    }

    for(let index = 0; index < sortBtns.length; index++){
        (activeSortBtn === sortBtns[index].dataset.sort) ? sortBtns[index].classList.add("active") : sortBtns[index].classList.remove("active");
    }
}

addRemoveClass();

function appendToHtml(obj){
    let appendInfo = "";

    loader.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
        loader.removeAttribute("style");
        document.body.removeAttribute("style");

        for(let i = 0; i < obj.Search.length; i++){
            appendInfo += `
                <tr>
                    <td class="movie-title">${obj.Search[i].Title}</td>
                    <td class="movie-date">${obj.Search[i].Year}</td>
                </tr>
            `;
        }
    
        tableBody.innerHTML = appendInfo;
    }, 500)
}

function ironManMovies(obj){
    const movieTitles = ["Iron Man", "Iron Man 2", "Iron Man 3"];
    const objIron = obj.Search.filter(item => item.Title === movieTitles[0] || item.Title === movieTitles[1] || item.Title === movieTitles[2]);
    obj.Search = objIron;
}

function sortByDate(obj){
    if(activeSortBtn === "date-up"){
        const movieDateOrderUp = obj.Search.sort((a, b) => a.Year < b.Year ? 1 : -1);
    } else if (activeSortBtn === "date-down"){
        const movieDateOrderDown = obj.Search.sort((a, b) => a.Year > b.Year ? 1 : -1);
    }
}

function sortByTitle(obj){
    if(activeSortBtn === "title-up"){
        const movieDateOrderUp = obj.Search.sort((a, b) => a.Title > b.Title ? 1 : -1);
    } else if (activeSortBtn === "title-down"){
        const movieDateOrderDown = obj.Search.sort((a, b) => a.Title < b.Title ? 1 : -1);
    }
}

function loadJson(){    
    fetch(`http://www.omdbapi.com/?s=${activeNavBtn}&apikey=d968cdce`)
    .then(res => res.json())
        .then(data => obj = data)
            .then(() => {
                if(activeNavBtn !== "iron+man"){
                    if(activeSortBtn === "date-up" || activeSortBtn === "date-down"){
                        sortByDate(obj)
                    } else if(activeSortBtn === "title-up" || activeSortBtn === "title-down"){
                        sortByTitle(obj);
                    }

                    appendToHtml(obj);
                } else {
                    ironManMovies(obj);

                    if(activeSortBtn === "date-up" || activeSortBtn === "date-down"){
                        sortByDate(obj)
                    } else if(activeSortBtn === "title-up" || activeSortBtn === "title-down"){
                        sortByTitle(obj);
                    }

                    appendToHtml(obj);
                }
            });
}

loadJson();