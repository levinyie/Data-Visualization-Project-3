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
    const svg = d3.select("svg")
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
