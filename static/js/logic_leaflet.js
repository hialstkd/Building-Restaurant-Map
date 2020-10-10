// --- Creating the Leaflet Map ---


// Defining layers
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    // maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    // maxZoom: 18,
    zoomOffset: -1,
    id: "dark-v10",
    accessToken: API_KEY
});


// Step 1: Setting up the size and colors for the circles
// ------------------------------------------------------
function markerSize(ratings) {
    return ratings * 250
}

// Creating the color scale for the ratings
function getColor(d) {
    return d >= 5.0 ? '#8B008B' :
           d >= 4.0 ? '#483D8B' :
           d >= 3.0 ? '#663399' :
           d >= 2.0 ? '#6A5ACD' :
           d >= 1.0 ? '#9370DB' :
                        '#FFA07A';
}


// Step 3: Reading the data using D3
// ------------------------------------------------------
var yelpData = "/data";

d3.json(yelpData, function (data) {

    // Updating the map upon dropdown selection
    d3.select("#inputGroupSelect04").on("change", createLayer);

    // Dropdown menu selection
    var dropdownMenu = d3.select("#inputGroupSelect04");
    var category = dropdownMenu.property("value");

    var circles = L.layerGroup();

    // Creating map object
    var myMap = L.map("viz-2", {
        center: [36.1699, -115.1398],
        zoom: 10,
        layers: [lightmap, circles]
    });

    // Creating a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map View": lightmap,
        "Dark Map View": darkmap
    };

    // Creating an overlayMaps object to hold the circles layer
    var overlayMaps = {
        "Ratings": circles
    };

    // Creating layer control, passing in baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Creating legend
    var legend = L.control({ position: 'topright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var star_rating = [0, 1.0, 2.0, 3.0, 4.0];

        var legendHeader = '<h6><b>Rating Score<br>by Stars<br></h6></b><hr>'
        div.innerHTML = legendHeader;

        for (var i = 0; i < star_rating.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(star_rating[i] + 1) + '"></i> ' + star_rating[i] + (star_rating[i + 1] ? ' - ' + star_rating[i + 1] + '<br>' : ' + ');
        };

        return div;
    };

    // Adding legend to map
    legend.addTo(myMap);


    function createLayer() {

        // Removing layer or circles after new selection of category
        myMap.removeLayer(circles);

        // Dropdown menu selection
        var dropdownMenu = d3.select("#inputGroupSelect04");
        var category = dropdownMenu.property("value");

        console.log(category);

        // Initializing an array to hold circleMarkers
        var circleMarkers = [];

        // Looping through the data to later make circles and bind pop-ups for category selected
        for (var i = 0; i < data.length; i++) {
            // var categories = data[i].categories;
            var businessName = data[i].name;
            var address = data[i].address;
            var city = data[i].city;
            var state = data[i].state;
            var zipCode = data[i].postal_code;
            var ratings = data[i].stars;
            var reviews = data[i].review_count;
            var lat = data[i].latitude;
            var lng = data[i].longitude;


            // If statement, to search and create pop-ups dependent on dropdownMenu selection
            if (data[i].categories.includes(category)) {

                // For each (lat, lng), create a marker and bind a popup w/ business info
                var circleMarker = L.circle([lat, lng], {
                    radius: markerSize(ratings),
                    fillColor: getColor(ratings),
                    fillOpacity: 0.8,
                    stroke: true,
                    color: 'black',
                    weight: 0.5
                }).bindPopup("<h6><b>Place: " + businessName + "<br></b></h6><hr>" +
                    "<p>Address: " + address + " " + city + ", " + state + ", " + zipCode + "<br>" +
                    "Categories: " + category + "<br>" +
                    "No. Reviews: " + reviews + "<br>" +
                    "Star Rating: " + ratings + "</p>");

                // Adding the marker to the circleMarkers array
                circleMarkers.push(circleMarker);
            }
        }

        // Creating a layer group made from the circleMarkers array, passing it into the createMap function
        circles = L.layerGroup(circleMarkers).addTo(myMap);
    }
})