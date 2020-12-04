//---------------À FAIRE-----------------//
// [] Repositionner les légendes 
// [] Changer de couleur pour le titre des bubbles
// [] Changer le titre
// [] Redisposer les bubbles pour éviter l'effet paquet 
// [] Problème de couleur pour certaines villes 

// set the dimensions and margins of the graph
var margin = { top: 65, right: 20, bottom: 50, left: 45 },
    width = 646 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

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
    //     TITLE & AXIS & SCALE   //
    // ---------------------------//
    svg_graph1.append("text")
    .attr("x", (width / 2))
    .attr("y", 15 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "bold")
    .text("Villes suisses et choix de mobilité");
    // Add X axis
    var x = d3.scaleLinear()
        .domain([10, 70])
        .range([0, width-(width/5)]);
    svg_graph1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(4));

    // Add X axis label:
    svg_graph1.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 30)
        .text("[%]Part des pendulaires en transport public")
        //.attr("text-anchor", "right")
        .style("font-size", "14px")
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.75px");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([10, 70])
        .range([height, 0]);
    svg_graph1.append("g")
        .call(d3.axisLeft(y));

    // Add Y axis label:
    svg_graph1.append("text")
        .attr("text-anchor", "end")
        .attr("x", - 210)
        .attr("y", - 30)
        .text("[%]Part des pendulaires en auto")
        .attr("text-anchor", "start")
         //.attr("text-anchor", "right")
         .attr("transform", "rotate(-90)")
         .style("font-size", "14px")
         .style("text-decoration", "italic")
         .style("letter-spacing", "-0.75px");

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
        .domain([330, 650])
        .range([2, 30]);

    // Add a scale for bubble color
    
    //mygroup = ["Zurich", "Berne", "Lucerne", "Bale", "St-Gall", "Lugano", "Lausanne", "Geneve"]
    mygroup = ["Zurich_ville", "Zurich_agglo", "Berne_ville", "Berne_agglo", "Lucerne_ville", "Lucerne_agglo", "Bale_ville", "Bale_agglo", "St-Gall_ville", "St-Gall_agglo", "Lugano_ville", "Lugano_agglo", "Lausanne_ville", "Lausanne_agglo", "Geneve_ville", "Geneve_agglo"]
 var myColor2 = d3.scaleOrdinal()
        .domain(mygroup)
        .range(["#457b9d","#457b9d", "#e63946", "#e63946", "#48cae4", "#48cae4", "#2b2d42", "#2b2d42", "#006d77", "#006d77", "#b56576", "#b56576", "#52b788",  "#52b788", "#ffcb77","#ffcb77"]);
    
    var myColor = d3.scaleOrdinal()
        .domain(["Zurich", "Berne", "Lucerne", "Bale", "St-Gall", "Lugano", "Lausanne", "Geneve"])
        //.domain(mygroup)
        .range(["#457b9d", "#e63946", "#48cae4", "#2b2d42", "#006d77", "#b56576", "#52b788", "#ffcb77"]);
// zurich originelle couleur "#457b9d"
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
        .style("background-color", "grey")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
   /*
   VERSION OBSOLETE DU TOOLTIP
   var showTooltip = function(d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("concerne : " + d.villes + " et " + d.nbr_auto_1000hab + " automobiles")
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
    
*/



    var showTooltip = function(d) {
        tooltip
        .transition()
        .duration(200)
    
        tooltip
            .style("opacity", 1)
            .html("concerne : " + d.villes + " et " + d.nbr_auto_1000hab + " automobiles") 
            .style("left", (d3.mouse(this)[0] + 70) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px") 
    }

    var moveTooltip = function(d) {
        tooltip        
            .html("concerne : " + d.villes + " et " + d.nbr_auto_1000hab + " automobiles") 
            .style("left", (d3.mouse(this)[0] + 70) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
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
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight1 = function(d) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles1").style("opacity", .05)
            // expect the one that is hovered
        d3.selectAll("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight1 = function(d) {
        d3.selectAll(".bubbles1").style("opacity", 1)
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
        .attr("class", function(d) { return "bubbles1 " + d.cat })
        .attr("class", function(d) { return "bubbles2 " + d.cat2 })
        .attr("cx", function(d) { return x(d.tp_2018); })
        .attr("cy", function(d) { return y(d.Auto_18); })
        .attr("r", function(d) { return z(d.nbr_auto_1000hab); })
        .style("fill", function(d) { return myColor2(d.villes); })
        .style("stroke", function(d) { return mycolor_agglo(d.cat2); })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)



    // ---------------------------//
    //       Nbr autos LEGENDES   //
    // ---------------------------//
    // Add legend: circles
    var valuesToShow = [350, 450, 650]
    var xCircle = 80
    var xLabel = 120
    var yCircle = 305

    svg_graph1
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d) { return yCircle - 100 - z(d) })
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
        .attr('y1', function(d) { return yCircle - 100 - z(d) })
        .attr('y2', function(d) { return yCircle - 100 - z(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg_graph1
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function(d) { return yCircle - 100 - z(d) })
        .text(function(d) { return d })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svg_graph1.append("text")
        .attr('x', xCircle -70)
        .attr("y", yCircle - 100 + 20)
        .text("Nombre d'autos pour 1000 habitants)")
        .attr("text-anchor", "left")
        .style("font-size", "12px")
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.75px");


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
        .attr("cx", 470)
        .attr("cy", function(d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d) { return myColor(d) })
        .on("mouseover", highlight1)
        .on("mouseleave", noHighlight1);
        


    // Add labels beside legend dots
    svg_graph1.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 475 + size * .8)
        .attr("y", function(d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) { return myColor(d) })
        .style("stroke","black")
        .style("stroke-width","0.09")
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.75px")
        .on("mouseover", highlight1)
        .on("mouseleave", noHighlight1);
        




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