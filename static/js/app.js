// The URL is where the data endpoint is on Flask, which is on the local server at "http://127.0.0.1:5000/data"
var url = "/data";

// Pull in and read the json formatted data using d3
d3.json(url, function (data) {

    // This array holds the value of each kind of food type there is a choice for
    var food_type = ["American", "Chinese", "Italian", "Mexican", "Japanese", "Thai", "Filipino", "Indian", "Korean", "French", "Mediterranean"];

    // This array creates a place holder for each food type for the doughnut chart
    var restaurant_count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Loop through the data, check if the data has the food_type category, if it does then add 1 to the counter for the 
    // food_type index in restaurant_count to count the number of restaurants in each category
    for (var x = 0; x < data.length; x++) {
        for (var y = 0; y < food_type.length; y++) {

            if (data[x]["categories"].includes(food_type[y])) {

                restaurant_count[y] += 1;
            }
        }
    };

    // This array will be used to create an object that contains the type and count of each kind of restaurant
    to_sort = [];

    // These arrays will be used to hold the sorted arrays in descending order
    num_restaurants = [];
    type_restaurants = [];

    // Create an object that holds the food type and counter in the same order they currently are
    for (var x = 0; x < restaurant_count.length; x++) {
        to_sort.push({'name': food_type[x], 'count': restaurant_count[x]})
    }

    // Sort the collection of objects.
    // If a is less than b, move it down one index, if a is equal to b, do nothing, else if a is greater than b, a moves up an index
    to_sort.sort(function(a, b) {
        return ((a.count < b.count) ? 1 : ((a.count == b.count) ? 0 : -1));
    });

    // Create arrays with the count of each restaurant type and the type of food now that it is sorted in descending order
    // These arrays will be used to create the doughnut chart so it is in descending fashion and not mixed up
    to_sort.forEach((key, value) => num_restaurants.push(to_sort[value]["count"]))
    to_sort.forEach((key, value) => type_restaurants.push(to_sort[value]["name"]))

    // And for a doughnut chart
    var cty = document.getElementById("Doughnut").getContext('2d');
    var myDoughnutChart = new Chart(cty, {
        type: 'doughnut',
        data: {
            datasets: [{
                label: '# of Restaurants',
                data: num_restaurants,
                backgroundColor: [
                    'rgba(187, 62, 62, .65)',
                    'rgba(191, 117, 64, .65)',
                    'rgba(187, 165, 62, .65)',
                    'rgba(62, 187, 104, .65)',
                    'rgba(62, 165, 187, .65)',
                    'rgba(44, 87, 130, .65)',
                    'rgba(75, 62, 187, .65)',
                    'rgba(127, 62, 187, .65)',
                    'rgba(180, 61, 184, .65)',
                    'rgba(107, 36, 101, .65)',
                    'rgba(50, 17, 36, .65)',
                ],
                borderColor: [
                    'rgba(187, 62, 62, 1)',
                    'rgba(191, 117, 64, 1)',
                    'rgba(187, 165, 62, 1)',
                    'rgba(62, 187, 104, 1)',
                    'rgba(62, 165, 187, 1)',
                    'rgba(44, 87, 130, 1)',
                    'rgba(75, 62, 187, 1)',
                    'rgba(127, 62, 187, 1)',
                    'rgba(180, 61, 184, 1)',
                    'rgba(107, 36, 101, 1)',
                    'rgba(50, 17, 36, 1)',

                ],
                borderWidth: 2
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: type_restaurants
        },
        options: {
            title: {
                display: true,
                text: `Number of Total Restaurants by Type`,
                fontSize: 20
            },
            legend: {
                labels: {
                    fontSize: 16
                }
            }
        }
    });

    // Create a variable that selects where the search type (type of food in this case) populates in the Search bar
    var selection = d3.select("#inputGroupSelect04");

    // When the user clicks on the Search button, call the updateChart function to update the bar chart
    var search = selection.on("change", updateChart);

    // Create a variable that stores the value of the selected food type (American, Mexican, Italian, etc)
    var value = selection.property("value");

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
    var ctx = document.getElementById("Bar").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stars,
            datasets: [{
                label: 'Number of Restaurants: ',
                data: starCount,
                borderColor: 'rgba(39, 99, 99, 1)',
                borderWidth: 2,
                backgroundColor: 'rgba(75, 192, 192, 0.75)',
            }]
        },
        options: {
            title: {
                display: true,
                text: `Number of Restaurants in each Star Rating Category`,
                fontSize: 16
            },
            legend: {
                display: false
            },
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
        // Check if the selection is the default, if it is then the title should be the default text
        if (value == "Choose a category...") {
            myChart.options.title.text = `Number of Restaurants in each Star Rating Category`;
        }
        // If the selection is a food type, it should display the title with the food type
        else {
            // Run a loop to get the total number of restaurants to add in the title of the bar chart
            for (var z = 0; z < to_sort.length; z++) {
                if (to_sort[z]["name"] == value) {
                    var display_num = to_sort[z]["count"]
                }
            }
            myChart.options.title.text = `Number of ${value} Restaurants in each Star Rating Category out of ${display_num}`;
        };

        // Change the color of the bar chart to match the doughnut chart
        if (value == "American") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(187, 62, 62, 1)';
                dataset.backgroundColor = 'rgba(187, 62, 62, .65)';
            });
        }
        else if (value === "Mexican") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(191, 117, 64, 1)';
                dataset.backgroundColor = 'rgba(191, 117, 64, .65)';
            });
        }
        else if (value == "Italian") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(187, 165, 62, 1)';
                dataset.backgroundColor = 'rgba(187, 165, 62, .65)';
            });
        }
        else if (value == "Chinese") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(62, 187, 104, 1)';
                dataset.backgroundColor = 'rgba(62, 187, 104, .65)';
            });
        }
        else if (value == "Japanese") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(62, 165, 187, 1)';
                dataset.backgroundColor = 'rgba(62, 165, 187, .65)';
            });
        }
        else if (value == "Thai") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(44, 87, 130, 1)';
                dataset.backgroundColor = 'rgba(44, 87, 130, .65)';
            });
        }
        else if (value == "Mediterranean") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(75, 62, 187, 1)';
                dataset.backgroundColor = 'rgba(75, 62, 187, .65)';
            });
        }
        else if (value == "Korean") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(127, 62, 187, 1)';
                dataset.backgroundColor = 'rgba(127, 62, 187, .65)';
            });
        }
        else if (value == "Filipino") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(180, 61, 184, 1)';
                dataset.backgroundColor = 'rgba(180, 61, 184, .65)';
            });
        }
        else if (value == "French") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(107, 36, 101, 1)';
                dataset.backgroundColor = 'rgba(107, 36, 101, .65)';
            });
        }
        else if (value == "Indian") {
            myChart.data.datasets.forEach((dataset) => {
                dataset.borderColor = 'rgba(50, 17, 36, 1)';
                dataset.backgroundColor = 'rgba(50, 17, 36, .65)';
            });
        };

        // Update the chart
        myChart.update();
    };
});