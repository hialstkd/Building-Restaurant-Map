// --- Creating the Leaflet Map ---

// Step 1: Setting up the size and colors for the circles
// ------------------------------------------------------
function markerSize(ratings) {
    return ratings * 15000
}

// Creating the color scale for the ratings
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
function createMap(circles) {

    // Defining layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // Creating a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Street Map View": streetmap
    };

    // Creating an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "Ratings": circles
    };

    // Creating map object
    var myMap = L.map("viz-2", {
        center: [38.8026, -116.4194],
        zoom: 6,
        layers: [streetmap, circles]
    });

    // Creating a layer control, passing in the baseMaps and overlayMaps. Adding the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Creating legend
    var legend = L.control({ position: 'topright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var star_rating = [0, 1.0, 2.0, 3.0, 4.0];

        var legendHeader = '<h6><b>Rating Score<br></h6></b><hr>'
        div.innerHTML = legendHeader;

        for (var i = 0; i < star_rating.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(star_rating[i] + 1) + '"></i> ' + star_rating[i] + (star_rating[i + 1] ? ' - ' + star_rating[i + 1] + '<br>' : ' + ');
        };

        return div;
    };

    // Adding legend to map
    legend.addTo(myMap);
}


// // Calling createMap function to render map
// createMap(circles);


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

        console.log(category);

        // Initializing an array to hold circleMarkers
        var circleMarkers = [];

        // Looping through the data to later make circles and bind pop-ups for category selected
        for (var i = 0; i < data.length; i++) {
            var categories = data[i].categories;
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
            if (categories.includes(category)) {
                console.log(categories);
                console.log(lat);
                console.log(lng);

                // For each (lat, lng), create a marker and bind a popup w/ business info
                var circleMarker = L.marker([lat, lng], {
                    radius: markerSize(ratings),
                    fillColor: getColor(ratings),
                    fillOpacity: 0.8,
                    stroke: true,
                    color: 'black',
                    weight: 0.25
                }).bindPopup("<h6><b>Place: " + businessName + "<br></b><hr>" +
                    "Address: " + address + " " + city + " " + state + " " + zipCode + "</h6><br>" +
                    "<p>Categories: " + categories + "<br>" +
                    "No. Reviews: " + reviews + "<br>" +
                    "Star Rating: " + ratings + "</p>");

                // Adding the marker to the circleMarkers array
                circleMarkers.push(circleMarker);
            }
        }

        // Creating a layer group made from the circleMarkers array, passing it into the createMap function
        createMap(L.layerGroup(circleMarkers));
    })
};

// Calling updateMap function to render updates to map
updateMap();