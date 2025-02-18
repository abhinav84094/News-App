let categories = ["business", "sport"];

let currentCategory = "business";
let currentPage = 1;
let pageSize = 12;
let isLoading = false;
let apiKey = "2994c634132f4da882bf8273a955cdc2";

const navDrawer = document.querySelector("#nav-drawer");
const navBar = document.querySelector("#nav-bar");
const drawerBar = document.querySelector("#drawer-bar");
const toggleButton = document.querySelector("#toggle-mode");
const errorDiv = document.querySelector("#error");
const newsContainer = document.querySelector("#news-container");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-drawer-btn");
const searchInput = document.querySelector("#search-input");
let searchQerry = "" ;


let debounceTimer;

function debounce(fun, delay){
    return (...args)=>{
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(()=>{
            fun(...args);
        }, delay) ;
    }
}

searchInput.addEventListener("input", debounce((e)=>{
    searchQerry = e.target.value ;
    currentPage =1;
    newsContainer.innerHTML = "";
    fetchNews();
},500))


menuBtn.addEventListener("click", ()=>{
    navDrawer.classList.toggle('open');
})

closeBtn.addEventListener("click", ()=>{
    navDrawer.classList.toggle('open');
})

async function fetchNews(){
    if(isLoading) return ;
    isLoading = true;
    errorDiv.classList.add("hidden");
    try{
        const queryParam = searchQerry ? `&q=${searchQerry}` :  `&category=${currentCategory}` ;

        // const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&page=${currentPage}&pageSize=${pageSize}${queryParam}&apiKey=${apiKey}`);
        // const response = await fetch(`https://newsapi.org/v2/everything?q=${queryParam}&from=2025-01-18&sortBy=publishedAt&apiKey=2994c634132f4da882bf8273a955cdc2`);

        const endpoint = searchQerry
            ? `https://newsapi.org/v2/everything?${queryParam}&from=2025-01-18&sortBy=publishedAt&page=${currentPage}&pageSize=${pageSize}&apiKey=${apiKey}`
            : `https://newsapi.org/v2/top-headlines?country=us&${queryParam}&page=${currentPage}&pageSize=${pageSize}&apiKey=${apiKey}`;


        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(data)

        displayNews(data.articles);
        currentPage++ ;
    }catch(error){
        errorDiv.classList.remove("hidden");
    }finally{
        isLoading = false ;
    }
}

fetchNews()

function displayNews(articles){
    articles.forEach(article =>{
        const newsItem = document.createElement("div");
        newsItem.classList.add('news-item');
        newsItem.innerHTML = `
        <img src="${article.urlToImage || 'news.png'}" alt="News Image" />
        <div class="content">
        <h2>${article.title}</h2>
        <p>${article.description  ||  'No news description found'}</p>
        <a href="${article.url}" target="_blank">Read More</a>
        </div>
        `
        newsContainer.appendChild(newsItem);
    })
}

function createCategoryElements(parent){
    categories.forEach(category=>{
        const navItem = document.createElement("div");
        navItem.classList.add("nav-item");
        navItem.textContent = category.charAt(0).toUpperCase()+ category.slice(1);
        navItem.addEventListener('click', ()=>{
            currentCategory = category;
            currentPage = 1;``
            newsContainer.innerHTML = '';
            fetchNews();
        })
        parent.appendChild(navItem);
    })
}

toggleButton.addEventListener("click", ()=>{
    document.body.classList.toggle("dark-mode");
    toggleButton.innerHTML = document.body.classList.contains("dark-mode")
    ? '<i class="fa-solid fa-toggle-on"></i>'
    : '<i class="fa-solid fa-toggle-off"></i>';
})

window.addEventListener("scroll" , ()=>{
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight-500){
       fetchNews(); 
    }
})




createCategoryElements(navBar)
createCategoryElements(drawerBar)