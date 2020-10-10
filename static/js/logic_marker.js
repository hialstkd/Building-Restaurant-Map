// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});
var map = L.map("viz-1", {
  center: [36.1669, -115.1398],
  zoom: 11,
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Have a base marker on Las Vegas Coordinate
var lat = 36.1669;
var long = -115.1398
var currentMarkers = [];
var baseMarker = L.marker([lat, long], {
  fillOpacity: 0.75,
  color: "blue",
  fillColor: "blue"
}).addTo(map);

// Marker for each categories
var newMarker = L.marker([lat, long], {
  fillOpacity: 0.75,
  color: "blue",
  fillColor: "blue"
})

baseMarker.bindPopup("Welcome to Las Vegas!");

function removeMarker(marker) {
  marker.remove();
}
// d3.selectAll("#inputGroupSelect04").on("click", function () {
//     newMarker.remove();
// });
d3.selectAll("#inputGroupSelect04").on("change", updateMap);

function updateMap() {
  d3.json("/data", function (data) {
    var dropdownMenu = d3.select("#inputGroupSelect04");
    var category = dropdownMenu.property("value");
    
    // remove markers 
    baseMarker.remove();
    if (currentMarkers !== null) {
      for (var i = currentMarkers.length - 1; i >= 0; i--) {
        currentMarkers[i].remove();
      }
    }
    // removeMarker(newMarker);
    // newMarker.remove()
    for (var i = 0; i < data.length; i++) {
      var name = data[i].name;
      var state = data[i].state;
      var city = data[i].city;
      var address = data[i].address;
      var zip = data[i].postal_code;
      var lat = data[i].latitude;
      var long = data[i].longitude;
      var categories = data[i].categories;
      console.log(lat);
      console.log(long);
      console.log(category);

      //Filtering through the category
      if (categories.includes(category)) {
        newMarker = L.marker([lat, long], {
          fillOpacity: 0.75,
          color: "blue",
          fillColor: "blue"
        }).addTo(map);
        newMarker.bindPopup("<h5>" + name +
          "</h5>" + "<hr>" + "Address: " + address + " " + city + " " + state + " " + zip + "<p>Categories:" + categories + "</p>")
        currentMarkers.push(newMarker);
      }
    }
  })
}