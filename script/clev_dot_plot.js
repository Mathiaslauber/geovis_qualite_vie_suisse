/*
[x]  Menu qui sélectionne les dates
[x]  Légendes avec des points    
[x]  Couleurs correspondantes pour chaque villes 
[x]  Nommer les axes 
[]  Titrer, expliquer 
[x]  Mettre la différence/ration sur les lignes
[x]  Mettre un tooltip
IDEE 
Tooltip bug 
[] METTRE LA VALEUR EXACT MIN ET MAX AVANT/ APRES CHAQUE LIGNE 
*/
// set the dimensions and margins of the graph


var margin = { top: 40, right: 40, bottom: 30, left: 160 },
    width = 600 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

// append the svg_clev object to the body of the page
var svg_clev = d3.select("#graph2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
/*// Features of the annotation
const annotations = [{
    note: {
        label: "Part des pendula",
        title: "Annotation title"
    },
    x: 475,
    y: 475,
    dy: 480,
    dx: 480
}]

// Add annotation to the chart
const makeAnnotations = d3.annotation()
    .annotations(annotations)
d3.select("#carto-1")
    .append("g")
    .call(makeAnnotations)

*/
svg_clev.append("text")
    .attr("x", (width / 2))
    .attr("y", 15 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "bold")
    .text("[%] de motorisation des pendulaires");

svg_clev.append("text")
    .attr("x", (width / 2))
    .attr("y", 450)
    .attr("text-anchor", "middle")
    .style("font-size", "8px")
    .style("text-decoration", "italic")
    .text("* Part des pendulaires utilisant un moyen de transport individuel motorisé (en %)");
//Part des pendulaires utilisant un moyen de transport individuel motoris� (en %)



// Ajout de l'interactivité 
/*const annees = [2014, 2015, 2016, 2017, 2018];

let cpData;

let current_distance_year = '2014';
let current_duree_year = '2014';

let condBars;
let condTitles;

let condScaleX, condScaleY;
let condColorScale;*/



// Parse the Data
d3.csv("data/lollipop_chart.csv", function(data) {
    sort = data.sort(function(a, b) {
        return b.r2014 - a.r2014;
    });
    // List of groups (here I have one group per column)
    //var allGroup = d3.map(data, function(d) { return (d.name) }).keys()
    // add the options to the button
    /*d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function(d) { return d; }) // text showed in the menu
        .attr("value", function(d) { return d; }) // corresponding value returned by the button*/
    // List of groups (here I have one group per column)
    var allGroup = ["r2014", "r2015", "r2016", "r2017", "r2018"]
        // add the options to the button
    d3.select("#selectButton_cleveland")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function(d) { return d; }) // text showed in the menu
        .attr("value", function(d) { return d; }) // corresponding value returned by the button



    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 0.7])
        .range([0, width]);
    svg_clev.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(4))

    svg_clev.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 30)
        .text("Ratio Distance [km] / temps[min] trajet");

    // Y axis
    var y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function(d) { return d.villes; }))
        .padding(1);
    svg_clev.append("g")
        .call(d3.axisLeft(y))


    var myColor = d3.scaleOrdinal()
        .domain(["Zurich_ville", "Zurich_agglo", "Berne_ville", "Berne_agglo", "Lucerne_ville", "Lucerne_agglo", "Bale_ville", "Bale_agglo", "St-Gall_ville", "St-Gall_agglo", "Lugano_ville", "Lugano_agglo", "Lausanne_ville", "Lausanne_agglo", "Geneve_ville", "Geneve_agglo"])
        .range(["#457b9d", "#457b9d", "#e63946", "#e63946", "#48cae4", "#48cae4", "#2b2d42", "#2b2d42", "#006d77", "#006d77", "#b56576", "#b56576", "#52b788", "#52b788", "#ffcb77", "#ffcb77"]);
    //---------------TOOLTIP---------------------//
    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select("#graph2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip_clev")
        .style("background-color", "#7fa6b9")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")



    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function(d) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function(d) {
        tooltip
            .html(d.villes + " : La distance moyenne entre 2014 et 2018 est de : " + d.dist_moy_14_19 + " [km] " + " La durée est de : " + d.duree_moy_14_18 + " [min]")
            .style("left", (d3.mouse(this)[0] + 200) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }


    // Lines
    var lines = svg_clev.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function(d) { return x(d.r2014); })
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.villes); })
        .attr("y2", function(d) { return y(d.villes); })
        //.attr("stroke", function(d) { return myColor(d.villes); })
        .attr("stroke-width", "1px")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    // Circles of variable 1
    var dot1 = svg_clev.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.r2014); })
        .attr("cy", function(d) { return y(d.villes); })
        .attr("r", "8")
        .style("fill", "#ffffff")
        //.style("fill", function(d) { return myColor(d.villes); })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    // Mettre le ratio à la fin de chaque couple 
    /*svg
        .selectAll("myLabels")
        .data(data)
        .enter()
        .append('g')
        .append("text")
        .attr("class", function(d) { return d.dur_2014 })
        .attr("transform", function(d) { return "translate(" + x(d.dur_2014) + "," + y(d.villes) + ")"; }) // Put the text at the position of the last point
        .attr("x", -50) // shift the text a bit more right
        .attr("y", 5) // shift the text a bit more right
        .text(function(d) { return d.Ratio_14; })
        .style("fill", "#4C4082")
        .style("font-size", 12)
    */

    /*// LEGEND //
    var size = 20
    var allgroups = ["Zurich_ville", "Zurich_agglo", "Berne_ville", "Berne_agglo", "Lucerne_ville", "Lucerne_agglo", "Bale_ville", "Bale_agglo", "St-Gall_ville", "St-Gall_agglo", "Lugano_ville", "Lugano_agglo", "Lausanne_ville", "Lausanne_agglo", "Geneve_ville", "Geneve_agglo"]

    svg.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", 300)
        .attr("cy", function(d, i) { return 450 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d) { return color1(d) })
        /*.on("mouseover", highlight)
        .on("mouseleave", noHighlight)
        */


    // Add labels beside legend dots
    /*svg.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 320 + size * .2)
        .attr("y", function(d, i) { return 450 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) { return color1(d) })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
       */
    /*
            // create a list of keys
            //var keys = ["Zurich_ville", "Zurich_agglo", "Berne_ville", "Berne_agglo", "Lucerne_ville", "Lucerne_agglo", "Bale_ville", "Bale_agglo", "St-Gall_ville", "St-Gall_agglo", "Lugano_ville", "Lugano_agglo", "Lausanne_ville", "Lausanne_agglo", "Geneve_ville", "Geneve_agglo"]
            var svg = d3.select("#my_dataviz")
            var keys = ["Distance en [km]", "Durée en [min]"]
                // Usually you have a color scale in your chart already
            var color = d3.scaleOrdinal()
                .domain(keys)
                .range("#69b3a2", "#4C4082");

            // Add one dot in the legend for each name.
            Svg.selectAll("mydots")
                .data(keys)
                .enter()
                .append("circle")
                .attr("cx", 100)
                .attr("cy", function(d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", function(d) { return color(d) })


            // Add one dot in the legend for each name.
            Svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", 120)
                .attr("y", function(d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d) { return color(d) })
                .text(function(d) { return d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        */
    // A function that update the chart
    function update(selectedGroup) {

        // Create new data with the selection?
        var dataFilter = data.map(function(d) { return { villes: d.villes, value: d[selectedGroup] } })


        // Lines
        lines
            .data(dataFilter)
            .transition()
            .duration(2000)
            .attr("x1", function(d) { return x(d.value); })
            .attr("stroke", function(d) { return myColor(d.villes); })



        // Circles of variable 1
        dot1
            .data(dataFilter)
            .transition()
            .duration(2000)
            .attr("cx", function(d) { return x(d.value); })
            .attr("cy", function(d) { return y(d.villes); })
            .style("fill", function(d) { return myColor(d.villes); })


    }
    // When the button is changed, run the updateChart function
    d3.select("#selectButton_cleveland").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
        update(selectedOption)


    })


});