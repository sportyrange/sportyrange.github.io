new PerfectScrollbar('#time');

const lon = 11.39454; // Koordinaten IBK
const lat = 47.262661; // Koordinaten IBK

let map = L.map("mapWeather", {
    center: [lat, lon],
    zoom: 10,
    layers: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    })
});

let rainviewer = L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: 'Start/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Time:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
});
rainviewer.addTo(map);

let overlay = {
    stations: L.featureGroup(),

}

L.control.layers({}, {
    "Wetterstationen Tirol": overlay.stations,
}).addTo(map);

let awsUrl = "https://aws.openweb.cc/stations";
let aws = L.geoJson.ajax(awsUrl, {
    filter: function (feature) {
        return feature.properties.LT /*!== null -->ist unnötig!! */ ;

    },
    pointToLayer: function (point, latlng) {
        //console.log("point: ", point);
        let marker = L.marker(latlng, {

        });
        marker.bindPopup(`<h3>${point.properties.name} ${point.geometry.coordinates[2]} m</h3>
        <ul>
        <li>Position: Lat: ${point.geometry.coordinates[1]}<br>Lng: ${point.geometry.coordinates[0]}</li>
        <li>Datum: ${point.properties.date}</li>
        <li>Lufttemperatur: ${point.properties.LT} °C</li>
        <li>Windgeschwindigkeit: ${point.properties.WG} m/s</li>
        <li>Relative Luftfeuchte: ${point.properties.RH} %</li>
        <li>Schneehöhe: ${point.properties.HS} cm</li>
        <li> Grafik: <a href=https://lawine.tirol.gv.at/data/grafiken/1100/standard/tag/${point.properties.plot}.png> ${point.properties.plot} </a></li>
        </ul>`);
        //console.log("feature in filter", point);
        return marker;

    }
}).addTo(overlay.stations);
overlay.stations.addTo(map)

// Versuch --> Forecast zu integrieren - Nutzung von API der Open-Wheater map
//sportyrange API - openweahtermap key 6b674de39054a72d29926196d5d45168; id of Innsbruck

const OWKey = "6b674de39054a72d29926196d5d45168";
let forecast_apiurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily&APPID=${OWKey}&units=metric`;


let xlabel = []; // variablen für die Chart
let ytemp = []; // variablen für die chart 
let yfeeltemp = []; // Variable für Chart 
let ypres = []; // variable für Chart
let yrain = []; // variable für Chart
let yWeatherText = []; // variable für die tabelle
let yWeatherIcon = []; // variable für die Tabelle 

chartIt();
tableIT();
getForecast();
//Erstellen einer Line-Chart mit Stündlicher Vorhergesagter temperatur, Luftdruck und Luftfeuchte, Bewölkung 
// https://www.chartjs.org/docs/latest/charts/line.html
async function chartIt() {
    await getForecast();
    let canvas = document.getElementById('Forecast48h').getContext('2d');
    let ForecastChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: xlabel,
            datasets: [{
                label: 'Temperatur in °C',
                borderColor: 'rgb(255, 99, 132)',
                data: ytemp,
                yAxisID: 'TempY',
                datalabels: {
                    display: 'auto',
                    anchor: 'end',
                    align: 'top',
                    rotation: '-30',
                    color: 'rgb(255, 99, 132)',
                },
            }, {
                label: "Gefühlte Temperatur in °C",
                data: yfeeltemp,
                yAxisID: 'TempY',
                datalabels: {
                    display: 'auto',
                    anchor: 'end',
                    align: 'top',
                    rotation: '-30',

                },
            }, {
                label: "Erwarteter Niedrschlag in mm",
                data: yrain,
                yAxisID: 'RainY',
                type: 'bar',
                backgroundColor: '#2673bf',
                datalabels: {
                    display: 'auto',
                    align: 'end',
                    anchor: 'end',
                    align: 'top',
                    rotation: '-30',
                    color: '#2673bf',

                },

            }]
        },

        options: {
            scales: {
                yAxes: [{
                        id: "TempY",
                        type: "linear",
                        position: "left",
                        ticks: {
                            callback: function (value, index, values) {
                                return value + '°C';
                            },
                            steps: 1,
                            max: 30,

                        }
                    },
                    {
                        id: "RainY",
                        type: "linear",
                        position: "right",
                        ticks: {
                            callback: function (value, index, values) {
                                return value + ' mm';
                            },
                            beginAtZero: true,
                            steps: 1,
                            max: 10,
                        }

                    }
                ],

            }
        }
    });
};

//Eigentliche API abruf von OpenWeatherMap 
//Verwendung der Async function damit alles inder Richtigen Reihenfolge passieren kann 
async function getForecast() {
    const response = await fetch(forecast_apiurl);
    const data = await response.json();

    let rows = data.hourly;
    console.log(rows);
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        //console.log(row)
        let dt = row.dt; //UnixTime
        dateObj = new Date(dt * 1000);
        hours = dateObj.getHours(); // "normale" Zeit
        formattedTime = hours.toString().padStart(2, '0') + ` h`

        xlabel.push(formattedTime);
        let temp = row.temp;
        ytemp.push(temp);
        let feeltemp = row.feels_like;
        yfeeltemp.push(feeltemp);
        let pres = row.pressure;
        ypres.push(pres);

        let rainrow = row.rain;
        if (rainrow === undefined) {
            yrain.push(0);

        } else {
            let rain = rainrow["1h"];
            yrain.push(rain);
        }

        let weatherText = row.weather["0"].description;
        yWeatherText.push(weatherText);
        let weatherIcon = row.weather["0"].icon;
        yWeatherIcon.push(weatherIcon);
        //console.log(row.weather["0"].main); // row.weather["0"].main --> Text wie das Wetter wird
        //console.log(row.weather["0"].icon); // row.weather["0"].id --> Icon wie das wetter wird + ersetzen durch Symbole
        //console.log(row.weather["0"]);
    };

};


// Da das Plugin chart.js leider keine Grafiken mit implimentieren lässt und so die Icons für das vorhergesagte Wetter darzustellen füge ich einfach unten drunter eine Tabelle ein in der Das vorhergesagte wetter dargestellt wird

// https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces

//console.log(Array.isArray(yWeatherIcon)); // true --> wieso kann ich also nicht einzelne Elemente des Arrays ansprechen?? --> weil ich noch auf die getForcast Function warten muss

async function tableIT() {
    await getForecast();
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]
    let timeTab = document.getElementById("time");
    for (let i = 0; i < arr[45]; i++) {
        timeTab.innerHTML += `<tr><td> ${xlabel[i]}</td> <td> <img id="icons" src="icons_weather/${yWeatherIcon[i]}.png"></td> <td> ${yWeatherText[i]}</td><td> ${ytemp[i]} °C</td><td> ${yrain[i]} mm</td></tr>`;
    };
    /*let iconTab = document.getElementById("icon");
    for (let i = 0; i < arr[45]; i++) {
        iconTab.innerHTML += `<td> <img id="icons" src="icons_weather/${yWeatherIcon[i]}.png"></td>`;

    };
    let textTab = document.getElementById("discription");
    for (let i = 0; i < arr[45]; i++) {
        textTab.innerHTML += `<td> ${yWeatherText[i]}</td>`;

    };*/
    //console.log(iconTab);
    //console.log(xlabel);
};


//let arr = ["x", 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48] //test arr

//console.log(yWeatherIcon);