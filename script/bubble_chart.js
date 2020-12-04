//---------------À FAIRE-----------------//
// [] Repositionner les légendes 
// [] Changer de couleur pour le titre des bubbles
// [] Changer le titre
// [] Redisposer les bubbles pour éviter l'effet paquet 
// [] Problème de couleur pour certaines villes 

// set the dimensions and margins of the graph
var margin = { top: 40, right: 150, bottom: 60, left: 30 },
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_graph1 = d3.select("#graph1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/mobi_final_12_18.csv", function(data) {

    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//

    // Add X axis
    var x = d3.scaleLinear()
        .domain([10, 100])
        .range([0, width]);
    svg_graph1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(4));

    // Add X axis label:
    svg_graph1.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 50)
        .text("[%]Part des pendulaires en transport public");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([10, 100])
        .range([height, 0]);
    svg_graph1.append("g")
        .call(d3.axisLeft(y));

    // Add Y axis label:
    svg_graph1.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("[%]Part des pendulaires en transport individuel motorisé")
        .attr("text-anchor", "start")

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
        .domain([330, 650])
        .range([2, 30]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
        .domain(["Zurich", "Berne", "Lucerne", "Bale", "St-Gall", "Lugano", "Lausanne", "Geneve"])
        .range(["#457b9d", "#e63946", "#48cae4", "#2b2d42", "#006d77", "#b56576", "#52b788", "#ffcb77"]);

    var mycolor_agglo = d3.scaleOrdinal()
        .domain(["Ville-centre", "Agglomeration"])
        .range(["#000", "#7A7A7A"]);

    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//
    // regarder overstack flow pour le problème de tooltip 

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#graph1")
        .append("div")
        .style("opacity", 0)
        .attr("width", "100px")
        .attr("height", "100px")
        .attr("class", "tooltip_graph1")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("concerne : " + d.villes + "et " + d.nbr_auto_1000hab + " automobiles")
            .style("left", (d3.mouse(this).attr("cy") + "px"))
            .style("top", (d3.mouse(this).attr("cx") + "px"))
    }
    var moveTooltip = function(d) {
        tooltip
            .style("left", (d3.mouse(this).attr("cy") + "px"))
            .style("top", (d3.mouse(this).attr("cx") + "px"))
    }
    var hideTooltip = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }


    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function(d) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles2").style("opacity", .05)
            // expect the one that is hovered
        d3.selectAll("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d) {
        d3.selectAll(".bubbles2").style("opacity", 1)
    }


    // ---------------------------//
    //       CIRCLES              //
    // ---------------------------//

    // Add dots
    svg_graph1.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d) { return "bubbles " + d.cat })
        .attr("class", function(d) { return "bubbles2 " + d.cat2 })
        .attr("cx", function(d) { return x(d.tp_2018); })
        .attr("cy", function(d) { return y(d.Auto_18); })
        .attr("r", function(d) { return z(d.nbr_auto_1000hab); })
        .style("fill", function(d) { return myColor(d.cat); })
        .style("stroke", function(d) { return mycolor_agglo(d.cat2); })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)



    // ---------------------------//
    //       Nbr autos LEGENDES   //
    // ---------------------------//
    // Add legend: circles
    var valuesToShow = [350, 450, 650]
    var xCircle = 390
    var xLabel = 440
    svg_graph1
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d) { return height - 100 - z(d) })
        .attr("r", function(d) { return z(d) })
        .style("fill", "none")
        .attr("stroke", "grey")

    // Add legend: segments
    svg_graph1
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function(d) { return xCircle + z(d) })
        .attr('x2', xLabel)
        .attr('y1', function(d) { return height - 100 - z(d) })
        .attr('y2', function(d) { return height - 100 - z(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg_graph1
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function(d) { return height - 100 - z(d) })
        .text(function(d) { return d })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svg_graph1.append("text")
        .attr('x', xCircle)
        .attr("y", height - 100 + 30)
        .text("Nombre d'autos pour 1000 habitants)")
        .attr("text-anchor", "middle")


    // ---------------------------//
    //     Légendes de catégories //
    // ---------------------------//
    // TOOLTIP VILLES UNE PAR UNE 
    // Add one dot in the legend for each name.
    var size = 20
    var allgroups = ["Zurich", "Berne", "Lucerne", "Bale", "St-Gall", "Lugano", "Lausanne", "Geneve"]
    svg_graph1.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", 390)
        .attr("cy", function(d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d) { return myColor(d) })
        /*.on("mouseover", highlight)
        .on("mouseleave", noHighlight)
        */


    // Add labels beside legend dots
    svg_graph1.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 390 + size * .8)
        .attr("y", function(d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) { return myColor(d) })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        /*.on("mouseover", highlight)
        .on("mouseleave", noHighlight)
        */




    // HOVER VILLES ET AGGLO 
    // Add one dot in the legend for each name.
    var size = 20
    var allgroups = ["Ville-centre", "Agglomeration"]
    svg_graph1.selectAll("myrect2")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", 280)
        .attr("cy", function(d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d) { return mycolor_agglo(d) })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)



    // Add labels beside legend dots
    svg_graph1.selectAll("mylabels2")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 280 + size * .8)
        .attr("y", function(d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) { return mycolor_agglo(d) })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
})