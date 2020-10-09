// --- Creating the Leaflet Map ---


// Setting up the size and colors for the markers
// ----------------------------------------------
function markerSize(ratings) {
    return ratings * 100
}

function getColor(d) {
    return  d >= 5.0 ? '#800026' :
            d >= 4.0 ? '#BD0026' :
            d >= 3.0 ? '#E31A1C' :
            d >= 2.0 ? '#FC4E2A' :
            d >= 1.0 ? '#FD8D3C' :
                        '#FFEDA0';
}


// Creating the map canvas
// ----------------------------------------------
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

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        // maxZoom: 18,
        zoomOffset: -1,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define baseMaps object to hold base layers
    var baseMaps = {
        'Street View': streetmap,
        'Dark View': darkmap
    };

    // // Create overlay object to hold overlay layer
    // var overlayMaps = {
    //     Ratings: ratings
    // };

    // Creating map object
    var myMap = L.map("viz-2", {
        center: [36.1699, -115.1398],
        zoom: 6,
        layers: [streetmap]
    });

    // Create legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var star_rating = [0, 1.0, 2.0, 3.0, 4.0, 5.0];

        var legendHeader = '<h3> Star <br> Ratings </h3><hr>'
            div.innerHTML = legendHeader;

        for (var i = 0; i < star_rating.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(star_rating[i] + 1) + '"></i> ' + star_rating[i] + (star_rating[i + 1] ? ' - ' + star_rating[i + 1] + '<br>' : ' + ');
        };

        return div;
    };

    legend.addTo(myMap);
}


// Importing the data
// ----------------------------------------------
var yelpData = "/data";


// Updating the map upon dropdown selection
// ----------------------------------------------
d3.selectAll("#inputGroupSelect04").on("change", updateMap);

function updateMap(category) {

    d3.json(yelpData, function (data) {

        // Dropdown menu selection
        var dropdownMenu = d3.select("#inputGroupSelect04");
        var category = dropdownMenu.property("value");

        // Initial length prior to for loop
        // data.length = 0;

        // For loop, to data info to later use for circles and binding pop-ups
        // Not a geojson file therefore create an empty list to store the lat, lng
        var lat = [];
        var lng = [];

        for (var i = 0; i < data.length; i++) {
            var categories = data[i].categories;
            var businessName = data[i].name;
            var address = data[i].address;
            var city = data[i].city;
            var state = data[i].state;
            var zipCode = data[i].postal_code;
            var ratings = data[i].stars;
            var reviews = data[i].review_count;
            // var lat = data[i].latitude;
            // var lng = data[i].longitude;

            lat.push(data[i].latitude)
            lng.push(data[i].longitude)

            // console.log(lat)
            // console.log(lng)


            // // Gathering the coord (coordinates)
            // //

            // // If statement, to search and create pop-ups dependent on dropdownMenu selection
            // if (categories.includes(category)) {

            //     var newMarker = L.marker([lat, lng], {
            //         fillOpacity: 0.8,
            //         color: 'red',
            //         fillColor: 'red'
            //     }).addTo(myMap);

            //     newMarker.bindPopup("<h4><b>Place: " + businessName + "<br></b>" +
            //         "Address: " + address + " " + city + " " + state + " " + zipCode + "</h4><br>" +
            //         "<p>Categories: " + categories + "<br>" +
            //         "No. Reviews: " + reviews + "<br>" +
            //         "Star Rating: " + ratings + "</p>")
            // }
        }

        console.log(lat)
        console.log(lng)
        console.log(data.length)
    })
};