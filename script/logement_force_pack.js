// set the dimensions and margins of the graph
var width = 600
var height = 650

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

// Read data
d3.csv("log_surf_hab_m2.csv", function(data) {

    // Filter a bit the data -> more than 1 million inhabitants
    //data = data.filter(function(d) { return d.value > 10000000 })

    // Color palette for continents?
    var color = d3.scaleOrdinal()
        .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
        .range(["#457b9d", "#e63946", "#48cae4", "#2b2d42", "#006d77", "#b56576", "#52b788", "#ffcb77"]);
    //svg.selectAll(".firstrow").data(color).enter().append("circle").attr("cx", function(d, i) { return 30 + i * 60 }).attr("cy", 50).attr("r", 19).attr("fill", function(d) { return color(d) })

    //.range(d3.schemeSet1);
    // Legend manuelle 

    svg.append("text").attr("x", 25).attr("y", 30).style("font-size", "20px").text("Surface moyenne habitable par personne")
    svg.append("circle").attr("cx", 75).attr("cy", 120).attr("r", 65).style("fill", "none").style("stroke", "#000")
    svg.append("circle").attr("cx", 75).attr("cy", 150).attr("r", 35).style("fill", "none").style("stroke", "#000")


    svg.append("line").attr("x1", 75).attr("y1", 115).attr("x2", 170).attr("y2", 115).style("fill", "none").style("stroke", "#000")
    svg.append("line").attr("x1", 75).attr("y1", 55).attr("x2", 170).attr("y2", 55).style("fill", "none").style("stroke", "#000")

    svg.append("text").attr("x", 171).attr("y", 115).text("35 m2").style("font-size", "15px").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 171).attr("y", 55).text("50 m2").style("font-size", "15px").attr("alignment-baseline", "middle")
        // Size scale for countries
        //scalePow
        //More included for completeness, rather than practical usefulness, the power scale interpolates using a power (y = m * x^k + b) function. The exponent k is set using .exponent():
        /* var size = d3.scalePow()
             .exponent(0.2)
             .domain([0, 49])
             .range([5, 50]);*/
        // display bubble

    var size = d3.scaleLinear()
        .domain([30, 49])
        .range([15, 65]) // circle will be between 7 and 55 px wide

    // create a tooltip
    var Tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#F3F4F6")
        .style("border", "none")
        //.style("border-width", "2px")
        .style("border-radius", "5px")
        .style("min-width", "400px")
        .style("padding", "15px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip
            .style("opacity", 1)
    }
    var mousemove = function(d) {
        Tooltip
            .html(d.indicateurs + ", pour la ville de: " + d.villes + ": " + d.X2019 + " m2 ")
            .style("left", (d3.mouse(this)[0] + 50) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
    }


    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return size(d.X2019) })
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function(d) { return color(d.cat) })
        .style("fill-opacity", 0.8)
        .attr("stroke", "grey")
        .style("stroke-width", 3)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.7)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d) { return (size(d.X2019) + 3) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d) {
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
        });

    // What happens when a circle is dragged?
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }

})