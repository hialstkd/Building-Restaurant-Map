// The URL is where the data endpoint is on Flask, which is on the local server at "http://127.0.0.1:5000/data"
var url = "/data";

// Pull in and read the json formatted data using d3
d3.json(url, function (data) {

    // Use d3 to select the ID for where the search button is located
    var selection = d3.select("#search-button");

    // When the user clicks on the Search button, call the updateChart function to update the bar chart
    var search = selection.on("click", updateChart);

    // Create a variable that selects where the search type (type of food in this case) populates in the Search bar
    var foodType = d3.select("#inputGroupSelect04");

    // Create a variable that stores the value of the selected food type (American, Mexican, Italian, etc)
    var value = foodType.property("value");

    // If the value of the food type is not "Choose a category...", then call the updateChart function
    if (value != "Choose a category...") {
        updateChart()
    };

    // Stars array to hold the label values for the chart
    var stars = ["0+ Stars", "1+ Stars", "2+ Stars", "3+ Stars", "4+ Stars", "5 stars"];

    // chartData array to hold the initial 0 values for the chart
    // Index 0 is for 0-.99 stars, 1 is for 1-1.99 stars, 2 is for 2-2.99... 5 is for 5 stars
    var starCount = [0, 0, 0, 0, 0, 0];

    // Create the chart, set the type, insert the labels and starting data, change the color of the bars, begin the axis at 0
    var ctx = document.getElementById("Chart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stars,
            datasets: [{
                label: 'Number of Restaurants: ',
                data: starCount,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.75)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
    });

    // This function updates the chart whenever a new food type is selected (American, Mexican, Italian, etc)
    function updateChart() {

        // Variable from above that selects where the search type (type of food in this case) populates in the Search bar
        foodType = d3.select("#inputGroupSelect04");

        // Variable from above that stores the value of the selected food type (American, Mexican, Italian, etc)
        value = foodType.property("value");

        // Make sure starCount array is reinitalized at 0 so we don't include any prior values
        var starCount = [0, 0, 0, 0, 0, 0];

        // Loop through the data
        for (var x = 0; x < data.length; x++) {

            // If the categories provided by the restaurant match the selected type,
            // Update the starCount array index location that corresponds to the number of stars that restaurant has
            // If the restaurant has 3.7 stars, update index 3, add 1 to it's counter
            if (data[x]["categories"].includes(`${value}`)) {

                if (data[x]["stars"] >= 5) {
                    starCount[5] += 1;
                }
                else if (data[x]["stars"] >= 4) {
                    starCount[4] += 1;
                }
                else if (data[x]["stars"] >= 3) {
                    starCount[3] += 1;
                }
                else if (data[x]["stars"] >= 2) {
                    starCount[2] += 1;
                }
                else if (data[x]["stars"] >= 1) {
                    starCount[1] += 1;
                }
                else if (data[x]["stars"] >= 0) {
                    starCount[0] += 1;
                };
            };
        };
        // Update the data in the dataset for the chart
        myChart.data.datasets.forEach((dataset) => {
            dataset.data = starCount;
        });
        console.log(myChart.data.datasets);
        myChart.update();
    }
})