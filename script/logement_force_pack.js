//---------------À FAIRE-----------------//
// [x] replacer les titres  
// [x] changer la couleur des titres et des légendes
// []   
// [] 
// [] 

function logement_force_packing() {
    // set the dimensions and margins of the graph
    var sizeX = 400
    var sizeY = 430
    var margin_graph3 = { top: 50, right: 20, bottom: 30, left: 30 },
        width = sizeX - margin_graph3.left - margin_graph3.right,
        height = sizeY - margin_graph3.top - margin_graph3.bottom;
    // style couleurs 

        var colortitle =  ["#acadae"]
        var coloraxis =  ["#dce0e1"]
        var colorlegend = ["#5d6164"]
    // append the svg object to the body of the page
    var svg_graph3 = d3.select("#graph3")
        .append("svg")
        .attr("width", width + margin_graph3.left + margin_graph3.right)
        .attr("height", height + margin_graph3.top + margin_graph3.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin_graph3.left + "," + margin_graph3.top + ")");



    // Read data
    d3.csv("data/log_surf_hab_m2.csv", function(data) {

            // ---------------------- TITRE ---------------------//

            svg_graph3.append("text")
                .attr("x", margin_graph3.left + 140)
                .attr("y", 15 - (margin_graph3.top / 1.3))
                .attr("text-anchor", "middle")
                .style("font-size", "19px")
                .style("text-decoration", "bold")
                .style("fill", colortitle)
                .html("Logement : Surface en [m2] par habitant")
                .style("text-decoration", "italic")
                .style("letter-spacing", "-0.75px");

            // ---------------------- FOOTNOTE ---------------------//

            svg_graph3.append("text")
                .attr("x", margin_graph3.left - 60)
                .attr("y", margin_graph3.top - 57)
                .attr("text-anchor", "left")
                .style("font-size", "12px")
                .style("text-decoration", "bold")
                .text("* Il est possible de réorganiser les cercles et d'avoir des infobulles")
                .style("fill", colorlegend)
                .style("text-decoration", "italic")
                .style("letter-spacing", "-0.9px");

            // Color palette for continents?
            var color = d3.scaleOrdinal()
                .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
                .range(["#457b9d", "#e63946", "#48cae4", "#2b2d42", "#006d77", "#b56576", "#52b788", "#ffcb77"]);
            //svg.selectAll(".firstrow").data(color).enter().append("circle").attr("cx", function(d, i) { return 30 + i * 60 }).attr("cy", 50).attr("r", 19).attr("fill", function(d) { return color(d) })

            //.range(d3.schemeSet1);
            // Legend manuelle pour les cercles

            //svg_graph3.append("text").attr("x", 5).attr("y", 5).style("font-size", "20px").text("Surface moyenne habitable par personne")
            svg_graph3.append("circle").attr("cx", 15).attr("cy", 60).attr("r", 40).style("fill", "none").style("stroke", colorlegend)
            svg_graph3.append("circle").attr("cx", 15).attr("cy", 85).attr("r", 15).style("fill", "none").style("stroke", colorlegend)


            svg_graph3.append("line").attr("x1", 15).attr("y1", 70).attr("x2", 65).attr("y2", 70).style("fill", "none").style("stroke", colorlegend)
            svg_graph3.append("line").attr("x1", 15).attr("y1", 20).attr("x2", 65).attr("y2", 20).style("fill", "none").style("stroke", colorlegend)

            svg_graph3.append("text").attr("x", 70).attr("y", 70).text("35 m2").style("font-size", "14px").attr("alignment-baseline", "middle").style("letter-spacing", "-0.5px").style("fill", colorlegend)
            svg_graph3.append("text").attr("x", 70).attr("y", 20).text("50 m2").style("font-size", "154x").attr("alignment-baseline", "middle").style("letter-spacing", "-0.5px").style("fill", colorlegend)
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
                .range([5, 40]) // circle will be between 7 and 55 px wide

            // create a tooltip
            var Tooltip = d3.select("#graph3")
                .append("div")
                .style("opacity", 0)
                .attr("width", "100px")
                .attr("height", "100px")
                .attr("class", "tooltip_force")
                .style("background-color", "#bdc2ca")
                .style("border", "none")
                //.style("border-width", "2px")
                .style("border-radius", "5px")
                .style("min-width", "400px")
                .style("padding", "15px")




            // Three function that change the tooltip when user hover / move / leave a cell
            var mouseover = function(d) {
                Tooltip
                    .transition()
                    .duration(200)
                Tooltip
                    .style("opacity", 1)
                    //.html(d.indicateurs + ", pour la ville de: " + d.villes + ": " + d.X2019 + " m2 ")
                    .html("<table>" + "<thead>" + "<tr>" + "<th>Lieu :</th>" + "<th>m2 en 2014</th>" + "<th>m2 en 2019</th>" + "<th>tendance en m2</th>" + "</tr>" + "</thead>" + "<tbody>" + "<tr>" + "<td>" + d.villes + "</td>" + "<td>" + d.X2014 + "</td>" + "<td>" + d.X2019 + "</td>" + "<td>" + d.tendance + "</td>" + "</tr>" + "</tbody>" + "</table>")
                    .style("left", (d3.mouse(this)[0] + 70) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    .style("top", (d3.mouse(this)[1]) + "px")
            }
            var mousemove = function(d) {
                Tooltip
                    //.html(d.indicateurs + ", pour la ville de: " + d.villes + ": " + d.X2019 + " m2 ")
                    .html("<table>" + "<thead>" + "<tr>" + "<th>Lieu :</th>" + "<th>m2 en 2014</th>" + "<th>m2 en 2019</th>" + "<th>tendance en m2</th>" + "</tr>" + "</thead>" + "<tbody>" + "<tr>" + "<td>" + d.villes + "</td>" + "<td>" + d.X2014 + "</td>" + "<td>" + d.X2019 + "</td>" + "<td>" + d.tendance + "</td>" + "</tr>" + "</tbody>" + "</table>")
                    .style("left", (d3.mouse(this)[0] + 70) + "px")
                    .style("top", (d3.mouse(this)[1]) + "px")
            }
            var mouseleave = function(d) {
                Tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)

            }

            // Initialize the circle: all located at the center of the svg_graph3 area
            var node = svg_graph3.append("svg")
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
                .style("stroke-width", 1)
                //.style('stroke-dasharray', '3,5')
                .attr("stroke-dasharray", function(d) {
                    if (d.cat_x === "agglo") { //Threshold of 15
                        return "4,9";
                    } else {
                        return "0,0"
                    }
                })
                .style("stroke-linecap", "round")
                .on("mouseover", mouseover) // What to do when hovered
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .call(d3.drag() // call specific function when circle is dragged
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));



            /*  .attr("stroke-dasharray", function(d) {
                                if (d.cat_x == "ville") {   //Threshold of 15
                                    return "3,5";
                                }
                               
                                else {
                                    return "1,6"
                                }
                    });*/



            // Features of the forces applied to the nodes:
            // offset permet de réguler le retrait 
            var offset = 1.67
            var simulation = d3.forceSimulation()
                .force("center", d3.forceCenter().x(width / offset).y(height / offset)) // Attraction to the center of the svg area
                .force("charge", d3.forceManyBody().strength(.7)) // Nodes are attracted one each other of value is > 0
                .force("collide", d3.forceCollide().strength(.05).radius(function(d) { return (size(d.X2019) + 4) }).iterations(1)) // Force that avoids circle overlapping + distance les séparant

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
        // -------------------------- LEGENDE AGGLO VS VILLE ------------------------//
    var mycolor_dash = d3.scaleOrdinal()
        .domain(["Ville-centre", "Agglomeration"])
        //.range(["#000", "#7A7A7A"]);
        .range(["1,3", "0,0"]);


        // CERCLES //
    var size = 25
    var allgroups = ["Ville-centre", "Agglomeration"]
    svg_graph3.selectAll("myrect2")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", 250)
        .attr("cy", function(d, i) { return 12 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 12)
        .style("stroke-dasharray", function(d) { return mycolor_dash(d) })
        .attr("stroke", "grey")
        .style("fill", "none")
        .style("stroke-width", 1.5)
        .style("stroke-linecap", "round")
        //.style('stroke-dasharray', '3,5')
        // Add labels beside legend dots


        // LABELS //
        
    svg_graph3.selectAll("mylabels2")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 250 + size * .8)
        .attr("y", function(d, i) { return 0 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", colorlegend)
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "12px")
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.75px");

        svg_graph3
        .selectAll("myLegend_labels")
        .data(allgroups)
        //.data(allgroups)
        .enter()
        .append('g')
        .append('text')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '20px')
        .text(function(d) { return '\uf8cc' })
        .attr("x", 190 + size * .8)
        .attr("y", function(d, i) { return 0 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", colorlegend)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.75px");

}
logement_force_packing();