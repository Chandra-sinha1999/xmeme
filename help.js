
const resultContainer = document.querySelector('.memeBox');
const loadButton = document.querySelector('.load');

function fetchData() {
    fetch('/memes').then(function (res) {
        return res.json();
    }).then(function (memes) {
        var temp = "";
        memes.forEach(function(meme) {
            const div = document.createElement('div');
            temp += "<div class= 'userCap'>";
            temp += "<h4>" + meme.name + "</h4>";
            temp += "<br>";
            temp += "<h6>" +  meme.caption + "</h6>";
            temp += "<br>";
            temp += "<div class='imgBox'>"
            temp += "<img class='imageDis' src='" + meme.url +"'>";
            temp += "</div>";
            temp += "</div>";
            div.innerHTML = temp;
            temp = "";
            resultContainer.appendChild(div); 
        });
    });
};

resultContainer.innerHTML='';
fetchData();
