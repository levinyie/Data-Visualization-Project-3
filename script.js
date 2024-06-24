// Kevin's Graph 1 and 2

const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#histogram")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Fetch data from the API endpoint
fetch('http://localhost:5000/api/movies')
  .then(response => response.json())
  .then(data => {

    // Convert Runtime to numbers without " min"
    data.forEach(d => {
      d.Runtime = +d.Runtime.split(' ')[0]; 
    });

    // Group data by Year and count occurrences
    const yearCounts = d3.rollup(data, v => v.length, d => d.Year);

    // Convert yearCounts map to array of objects and sort by Year
    const histogramData = Array.from(yearCounts, ([key, value]) => ({ Year: +key, Count: value }))
                              .sort((a, b) => a.Year - b.Year);

    // Set up scales for x and y axes
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Runtime)])
      .nice()
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(histogramData.map(d => d.Year))
      .range([height, 0])
      .padding(0.1);

    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d"))); // Use "d3.format("d")" to format ticks as integers

    // Add y-axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add bars for histogram
    svg.selectAll("rect")
      .data(histogramData)
      .enter()
      .append("rect")
        .attr("x", 0) // Start bars from x=0
        .attr("y", d => y(d.Year))
        .attr("width", d => x(d.Count)) // Use Count as width of bars
        .attr("height", y.bandwidth())
        .style("fill", "#69b3a2");

    // Add labels
    svg.selectAll("text")
      .data(histogramData)
      .enter()
      .append("text")
        .attr("x", d => x(d.Count) + 5) // Adjust label position
        .attr("y", d => y(d.Year) + y.bandwidth() / 2)
        .text(d => d.Count) // Display count as label
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("alignment-baseline", "middle");

  })
  .catch(error => console.error('Error fetching data:', error));

  // Function to fetch data from API endpoint
  async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to create line chart of Average Runtime vs. Year
    async function createLineChart() {
        const data = await fetchData('http://localhost:5000/api/movies');

        // Converting Runtime to numbers without " min"
        data.forEach(d => {
            d.Runtime = +d.Runtime.split(' ')[0]; 
        });

        // Grouping data by Year and calculate average Runtime
        const yearGroups = d3.group(data, d => d.Year);
        const averageRuntimes = Array.from(yearGroups, ([key, value]) => {
            const averageRuntime = d3.mean(value, d => d.Runtime);
            return { Year: +key, AverageRuntime: averageRuntime };
        });

        // Sorting averageRuntimes array by Year
        averageRuntimes.sort((a, b) => a.Year - b.Year);

        // Margins and dimensions for the plot
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Append the SVG object to the div with id 'line-chart'
        const svg = d3.select("#line-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Set up scales for x and y axes
        const x = d3.scaleLinear()
            .domain([d3.min(averageRuntimes, d => d.Year), d3.max(averageRuntimes, d => d.Year)])
            .nice()
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(averageRuntimes, d => d.AverageRuntime)])
            .nice()
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.AverageRuntime));

        svg.append("path")
            .datum(averageRuntimes)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Add x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        // Add y-axis
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("text")
            .data(averageRuntimes)
            .enter()
            .append("text")
            .attr("x", d => x(d.Year))
            .attr("y", d => y(d.AverageRuntime))
            
            .attr("dx", 5) // Offset text horizontally
            .attr("dy", -5) // Offset text vertically
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("text-anchor", "start");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Average Runtime vs. Year");
    }


//Anna's Line Chart
    // Call function to create line chart
    createLineChart();

    const dataset = [
        { lang: 'Nama', revenue: 700426566.0 },
    { lang: 'Xhosa', revenue: 507271842.0 },
    { lang: 'Maya', revenue: 453829060.0 },
    { lang: 'Haitian', revenue: 453829060.0 },
    { lang: 'Flemish', revenue: 412845172.0 },
    { lang: 'Swahili', revenue: 388824332.0 },
    { lang: 'Quenya', revenue: 381201096.0 },
    { lang: 'Maltese', revenue: 376851080.0 },
    { lang: 'Sindarin', revenue: 347575257.0 },
    { lang: 'Maori', revenue: 335104314.0 }
    ];
    
    // Extracting labels and data from the dataset
    const labels = dataset.map(item => item.lang);
    const data = dataset.map(item => item.revenue);
    
    // Chart.js configuration
    const ctx = document.getElementById('myBarChart').getContext('2d');
    const myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

//Jevin's Top 10 Scatter Plot
    document.addEventListener("DOMContentLoaded", function() {
        // Data for the scatter plot
        const data = [
            {"Title": "Star Wars: Episode VII - The Force Awakens", "BoxOffice": 936662225.0, "Awards": 204},
            {"Title": "Avengers: Endgame", "BoxOffice": 858373000.0, "Awards": 203},
            {"Title": "Spider-Man: No Way Home", "BoxOffice": 814115070.0, "Awards": 106},
            {"Title": "Avatar", "BoxOffice": 785221649.0, "Awards": 225},
            {"Title": "Top Gun: Maverick", "BoxOffice": 718732821.0, "Awards": 342},
            {"Title": "Black Panther", "BoxOffice": 700426566.0, "Awards": 415},
            {"Title": "Avatar: The Way of Water", "BoxOffice": 684075767.0, "Awards": 226},
            {"Title": "Avengers: Infinity War", "BoxOffice": 678815482.0, "Awards": 126},
            {"Title": "Jurassic World", "BoxOffice": 653406625.0, "Awards": 73},
            {"Title": "The Avengers", "BoxOffice": 623357910.0, "Awards": 120},
            // Add more data points here
        ];
    
        // Sort the data by BoxOffice in descending order and get the top 10 movies
        const topMovies = data.sort((a, b) => b.BoxOffice - a.BoxOffice).slice(0, 10);
    
        // Extract titles for tooltips
        const titles = topMovies.map(item => item.Title);
    
        // Generate random colors for each movie
        const colors = topMovies.map(() => `hsl(${Math.random() * 360}, 100%, 75%)`);
    
        // Configuration for the scatter plot
        const config = {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Movies',
                    data: topMovies.map((item, index) => ({
                        x: item.BoxOffice,
                        y: item.Awards,
                        backgroundColor: colors[index]
                    })),
                    pointBackgroundColor: colors,
                    backgroundColor: colors
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Box Office ($)'
                        },
                        beginAtZero: true
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Awards'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const title = titles[context.dataIndex];
                                return `${title}: Box Office $${context.raw.x.toLocaleString()}, Awards ${context.raw.y}`;
                            }
                        }
                    }
                }
            }
        };
    
        // Render the scatter plot
        const boxOfficeAwardsChart = new Chart(
            document.getElementById('boxOfficeAwardsChart'),
            config
        );
    });
  

//Muhammad's Graph
console.log("Script is running");

// parse box office values to numbers
function parseBoxOffice(value) {
    if (!value) return 0;
    return +value.replace(/[\$,]/g, '');
}

// Loading the CSV data
d3.csv("data/movies.csv").then(data => {
    console.log("CSV data loaded");

    // Parse the data
    // converting boxoffice to number
    data.forEach(d => {
        d.Year = +d.Year;
        d.Runtime = +d.Runtime.replace(" min", ""); 
        d.BoxOffice = parseBoxOffice(d.BoxOffice); 
        
        // Extracting the rating 
        try {
            const ratings = JSON.parse(d.Ratings.replace(/'/g, '"'));
            const imdbRating = ratings.find(r => r.Source === 'Internet Movie Database');
            d.Rating = imdbRating ? parseFloat(imdbRating.Value.split('/')[0]) : 0;
        } catch (e) {
            console.error("Error parsing ratings for:", d.Title, e);
            d.Rating = 0;
        }
    });

    console.log("Data parsed", data);

    // Sort the data
    // extracting Top ten movies by boxoffice 
    let topMovies = data.sort((a, b) => b.BoxOffice - a.BoxOffice).slice(0, 10);

    // dimensions and margins
    const margin = { top: 30, right: 30, bottom: 170, left: 60 },
          width = 960 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Appending svg
    const svg = d3.select("#barcharttop10")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(topMovies.map(d => `${d.Title} ($${d.BoxOffice.toLocaleString()})`))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(topMovies, d => d.Rating)]) 
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(topMovies)
      .enter()
      .append("rect")
        .attr("x", d => x(`${d.Title} ($${d.BoxOffice.toLocaleString()})`))
        .attr("y", d => y(d.Rating))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Rating))
        .attr("fill", "#69b3a2");

    // labels
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 140) 
        .text("Movie Title and Box Office");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .text("Rating");

    // title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Top 10 Highest Box Office Movies by Rating");

    // rendering
    console.log("Rendering complete");
}).catch(error => {
    console.error('Error loading CSV file:', error);
});