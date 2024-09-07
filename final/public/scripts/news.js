$(function(){

    //url for request
    var url = "https://api.currentsapi.services/v1/latest-news?language=en&apiKey=2Tg1gW6MHJ1TwmuVQywXw56nDqJcl8Low-EEZZWDBlnG3loA";

    //use jquery json shortcut
        $.getJSON(url, function(jsondata){
            displayData(jsondata);
            //handle results
            prettyPrintJSON(jsondata);  //prints JSONdata to console
        });

});

function prettyPrintJSON(jsondata){
    //prints the prettyJSON to console
    var pretty = JSON.stringify(jsondata, null, 4);
    console.log(pretty);
}

function displayData(jsondata){
    displayNewsStory(jsondata)
}

function displayNewsStory(jsondata){
    for(let i = 0; i < jsondata.news.length; i++){
        const newsArticle = document.getElementById('newsArticle');
        try{
            newsArticle.innerHTML += `
            
                <div class="article" id="article">
                    <a href="${jsondata.news[i].url}">
                        <div class="newsArticleImg" id="articleImg"><img onerror="this.style.display='none'" src="${jsondata.news[i].image}" alt=""></div>
                        <div class="title"><h1>${jsondata.news[i].title}</h1></div>
                        <div class="category"><p>(${jsondata.news[i].category})</p></div>
                        <div class="description"><p>${jsondata.news[i].description}</p></div>
                        <div class="articleFooter">
                            <div class="author"><p>${jsondata.news[i].author}</p></div>
                            <div class="published"><p>${jsondata.news[i].published.slice(0 , 10)}</p></div>
                        </div>
                    </a>
                </div>
            
            `

            
        } 
        catch(error){
            console.log(error);
        }
    }

    console.log(jsondata.news.length);
}