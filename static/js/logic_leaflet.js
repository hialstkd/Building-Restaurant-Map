// --- Creating the Leaflet Map ---


// Step 1: Setting up the size and colors for the circles
// ------------------------------------------------------
function markerSize(stars) {
    return stars * 15000
}

function getColor(d) {
    return d >= 5.0 ? '#006400' :
        d >= 4.0 ? '#228B22' :
            d >= 3.0 ? '#3CB371' :
                d >= 2.0 ? '#90EE90' :
                    d >= 1.0 ? '#98FB98' :
                        'FFA07A';
}


// Step 2: Creating the map function
// ------------------------------------------------------
function createMap() {

    // Defining layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // Creating map object
    var myMap = L.map("viz-2", {
        center: [38.8026, -116.4194],
        zoom: 6,
        layers: [streetmap]
    });

    // Creating legend
    var legend = L.control({ position: 'topright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var star_rating = [0, 1.0, 2.0, 3.0, 4.0];

        var legendHeader = '<h6><b>Rating<br></h6></b>* Based on stars<hr>'
        div.innerHTML = legendHeader;

        for (var i = 0; i < star_rating.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(star_rating[i] + 1) + '"></i> ' + star_rating[i] + (star_rating[i + 1] ? ' - ' + star_rating[i + 1] + '<br>' : ' + ');
        };

        return div;
    };

    legend.addTo(myMap);
}


// Calling createMap function to render map
createMap();


// Step 3: Reading the data using D3
// ------------------------------------------------------
var yelpData = "/data";

// Updating the map upon dropdown selection
d3.select("#inputGroupSelect04").on("change", updateMap);

function updateMap() {

    d3.json(yelpData, function (data) {

        // Dropdown menu selection
        var dropdownMenu = d3.select("#inputGroupSelect04");
        var category = dropdownMenu.property("value");


        // For loop, to data info to later use for circles and binding pop-ups
        // Not a geojson file therefore create an empty array to store the coordinates (lat, lng)
        var coords = [];

        for (var i = 0; i < data.length; i++) {
            var categories = data[i].categories;
            var businessName = data[i].name;
            var address = data[i].address;
            var city = data[i].city;
            var state = data[i].state;
            var zipCode = data[i].postal_code;
            var ratings = data[i].stars;
            var reviews = data[i].review_count;

            coords.push([data[i].latitude, data[i].longitude])

            // If statement, to search and create pop-ups dependent on dropdownMenu selection
            if (categories.includes(category)) {
                // Loop through the coords array and create a circle for each coord object
                for (var i = 0; i < coords.length; i++) {
                    L.circle(coords, {
                        fillOpacity: 0.8,
                        color: 'black',
                        fillColor: 'green',
                        radius: markerSize(ratings) 
                    }).bindPopup("<h6><b>Place: " + businessName + "<br></b><hr>" +
                        "Address: " + address + " " + city + " " + state + " " + zipCode + "</h6><br>" +
                        "<p>Categories: " + categories + "<br>" +
                        "No. Reviews: " + reviews + "<br>" +
                        "Star Rating: " + ratings + "</p>").addTo(myMap);
                }
            }

            console.log(categories);
            console.log(ratings);
            console.log(reviews);
            console.log(coords[0]);
            

        }
    })
};


// Calling updateMap function to render updates to map
updateMap();