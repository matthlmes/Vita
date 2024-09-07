$(function(){
    //url for request
    var url = 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/3091?res=3hourly&key=063dfa78-bc56-4980-a1d1-0ad37ae0e610';
    
    //use jquery json shortcut
    $.getJSON(url, function(jsondata){
        populateHTML(jsondata);
        //handle results
        //prettyPrintJSON(jsondata);  //Remove Later
    });     

});


function populateHTML(jsondata){
    //Array of different weather types (only a number is given by api which aligns with array number)
    const weatherArray = ["Clear Night", "Sunny Day", "Partly Cloudy (night)", "Partly Cloudy (day)", "Not Used", "Mist", "Fog", "Cloudy", "Overcast", "Light rain shower (night)", "Light rain shower (day)", 
"Drizzle", "Light Rain", "Heavy rain shower (night)", "Heavy rain shower (day)", "Heavy rain", "Sleet Shower (night)", "Sleet Shower (day)", "Sleet", 
"Hail shower (night)", "Hail shower (day)", "Hail", "Light snow shower (night)", "Light snow shower (day)", "Light Snow", "Heavy snow shower (night)",
"Heavy snow shower (day)", "Heavy Snow", "Thunder shower (night)", "Thunder shower (day)", "Thunder"]

    //Current Weather
    getCurrentWeather(jsondata, weatherArray);

    //3 Hour Forecast
    get3HourForecast(jsondata);

    //4 Day Forecast   
    get4DayForecast(jsondata, weatherArray);

    //Bottom of Page

    //Visibility
    getVisibility(jsondata);

    //UV Index
    getUVIndex(jsondata);

    //Humidity
    getHumitdity(jsondata);
    
}



//Gets Current Weather Values and displays them
function getCurrentWeather(jsondata, weatherArray){
    //Assigns the variables from the given JSON data
    var City = jsondata.SiteRep.DV.Location.name;
    var Country = jsondata.SiteRep.DV.Location.country;
    var CurrTemp = jsondata.SiteRep.DV.Location.Period[0].Rep[0].T;

    var CurrTypeNum = jsondata.SiteRep.DV.Location.Period[0].Rep[0].W;
    var CurrType = weatherArray[CurrTypeNum];

    //Adds Values to HTML page using the specific Class and ID tags
    $(".place").append("<p>" + City + "</p>");
    $(".country").append("<p>" + Country + "</p>");
    $(".temperature").append(+ CurrTemp, "\u00B0");
    $("#current-weather-type").append(CurrType);
}



//Gets 3 Hour Forecast Values for the day and displays them
function get3HourForecast(jsondata){
    const hourlytemps = [];
    const hours = [];

    for(let i = 0; i < jsondata.SiteRep.DV.Location.Period[0].Rep.length; i++){
        hourlytemps[i] = jsondata.SiteRep.DV.Location.Period[0].Rep[i].T;
        hours[i] = jsondata.SiteRep.DV.Location.Period[0].Rep[i].$ / 60 + ":00";
    }

    //for loop to add data to hmtl
    for (let i = 0; i < hours.length; i++){
        $("#hour" + i).append(hours[i]);
        $("#hour-temp" + i).append(hourlytemps[i] + "\u00B0");
    }

    showDivs(hours);
}


//Shows only the relevant Divs for the 3 houry forecast
function showDivs(hours){
    for (let i = 0; i < hours.length; i++){
        document.getElementById("parent"+i).style.display = 'inline-block';
    }
}



//Gets 4 Day Forecast Values and displays them
function get4DayForecast(jsondata, weatherArray){
    const weatherTypes = [];

    //gathers all upcoming weather types in an array
    for (let i = 0; i < 4; i++){
        weatherTypes[i] = weatherArray[jsondata.SiteRep.DV.Location.Period[i].Rep[0].W];
    }

    //Populates forecast images
    getWeatherImg(weatherTypes, weatherArray);


    //Day 1
    //Getting Date and changing it to it's name e.g (Monday)
    var Day1Value = jsondata.SiteRep.DV.Location.Period[1].value;
    var Day1Text = getDayName(Day1Value, "en-EN");

    $("#Day1-Value").append(Day1Text);
    $("#Day1-Weather-Type").append(weatherTypes[0]);


    //Day 2
    //Getting Date and changing it to it's name e.g (Monday)
    var Day2Value = jsondata.SiteRep.DV.Location.Period[2].value;
    var Day2Text = getDayName(Day2Value, "en-EN");

    $("#Day2-Value").append(Day2Text);
    $("#Day2-Weather-Type").append(weatherTypes[1]);



    //Day 3
    //Getting Date and changing it to it's name e.g (Monday)
    var Day3Value = jsondata.SiteRep.DV.Location.Period[3].value;
    var Day3Text = getDayName(Day3Value, "en-EN");

    $("#Day3-Value").append(Day3Text);
    $("#Day3-Weather-Type").append(weatherTypes[2]);


    //Day 4
    //Getting Date and changing it to it's name e.g (Monday)
    var Day4Value = jsondata.SiteRep.DV.Location.Period[4].value;
    var Day4Text = getDayName(Day4Value, "en-EN");

    $("#Day4-Value").append(Day4Text);
    $("#Day4-Weather-Type").append(weatherTypes[3]);
}



//Gets Visibility Values and displays them
function getVisibility(jsondata){
    const visibilityArray = ["UN", "VP", "PO", "MO", "GO", "VG", "EX"];
    const visibilityValues = ["Unknown", "Very Poor", "Poor", "Moderate", "Good", "Very Good", "Excellent"];

    var visibilityVal = jsondata.SiteRep.DV.Location.Period[0].Rep[0].V;

    for(let i = 0; i < visibilityArray.length; i++){
        if(visibilityVal == visibilityArray[i]){
            var visibility = visibilityValues[i];
        }
    }

    $("#visibilityValue").append(visibilityVal);
    $("#visibility").append(visibility);
}



//Gets UV Index Values and displays them
function getUVIndex(jsondata){
    //UV Index
    const UVindexValues = ["Low Exposure", "Moderate Exposure", "High Exposure", "Very High", "Extreme"];

    var UVindexVal = jsondata.SiteRep.DV.Location.Period[0].Rep[0].U;
    var UVvalue;

        if(UVindexVal <= 2){
            UVvalue = UVindexValues[0];
        }else if (UVindexVal >= 3 && UVindexVal <= 5){
            UVvalue = UVindexValues[1];
        }else if (UVindexVal == 6 || UVindexVal == 7){
            UVvalue = UVindexValues[2];
        }else if (UVindexVal >= 8 && UVindexVal <= 10){
            UVvalue = UVindexValues[3];
        }else if (UVindexVal >= 11){
            UVvalue = UVindexValues[4];
        }


    $("#UVvalue").append(UVvalue);
    $("#UVvalueNum").append(UVindexVal);
}


//Gets Humidity Values and displays them
function getHumitdity(jsondata){
    const HumidityArray = ["Dry", "Muggy", "Oppressive"];

    var HumidityVal = jsondata.SiteRep.DV.Location.Period[0].Rep[0].H;
    var HumidityDesc;

    if(HumidityVal <= 55){
        HumidityDesc = HumidityArray[0];
    }else if (HumidityVal >= 56 && HumidityVal <= 65){
        HumidityDesc = HumidityArray[1];
    }else if (HumidityVal >= 66){
        HumidityDesc = HumidityArray[2];
    }

    $("#HumidityVal").append(HumidityVal + "%");
    $("#HumidityDesc").append(HumidityDesc);
}


//Used to get Day Name for the Weekly forcast
function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

//get Weather type image
function getWeatherImg(weatherTypes, weatherArray){
          
    for (let i = 0; i < weatherTypes.length; i++){
        for (let x = 0; x < weatherArray.length; x++){
            if(weatherTypes[i] == weatherArray[x]){
                if(x === 1){
                    $("#Day-img"+i).append(sunny);
                    var sunny = document.createElement("img");
                    sunny.src = "images/sun.svg";
                    console.log(i + " Set to Sunny " + x)
                }
                else if(x >= 2 && x <= 8){
                    var cloudy = document.createElement("img");
                    cloudy.src = "images/cloudy.svg";
                    $("#Day-img"+i).append(cloudy);
                    console.log(i + " Set to Cloudy " + x)                  
                }                                                           
                else if(x >= 9 && x <= 21){
                    var rainy = document.createElement("img");
                    rainy.src = "images/rainy.svg";
                    $("#Day-img"+i).append(rainy);
                    console.log(i + " Set to Rainy " + x)
                }
                else if(x >= 22 && x <= 29){
                    var snowy = document.createElement("img");
                    snowy.src = "images/snowy.svg";
                    $("#Day-img"+i).append(snowy);
                    console.log(i + " Set to Snowy " + x)
                }
                else if(x >= 30 && x <= 32){
                    var thunder = document.createElement("img");
                    thunder.src= "images/thundery.svg";
                    $("#Day-img"+i).append(thunder);
                    console.log(i + " Set to Thunder " + x)
                }
                else{
                    var moon = document.createElement("img");
                    moon.src= "images/moon.svg";
                    $("#Day-img"+i).append(moon);
                    console.log(i + " Set to Moon " + x)
                }
            }
        }
    }
}


//Remove Later
function prettyPrintJSON(jsondata){
    //prints the prettyJSON to console
    var pretty = JSON.stringify(jsondata, null, 4);
    console.log(pretty);
}


