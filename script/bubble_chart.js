//---------------À FAIRE-----------------//
// [x] Repositionner les légendes 
// [x] Changer de couleur pour le titre des bubbles
// [x] Changer le titre
// [-] Redisposer les bubbles pour éviter l'effet paquet 
// [x] Problème de couleur pour certaines villes 


function bubble_chart() {
    // set the dimensions and margins of the graph
    let margin_descr1 = { top: 30, right: 20, bottom: 20, left: 45 },
        width = 646 - margin_descr1.left - margin_descr1.right,
        height = 400 - margin_descr1.top - margin_descr1.bottom;

    // append the svg object to the body of the page
    var svg_graph1 = d3.select("#descriptif1")
        .append("svg")
        .attr("width", width + margin_descr1.left + margin_descr1.right)
        .attr("height", height + margin_descr1.top + margin_descr1.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin_descr1.left + "," + margin_descr1.top + ")");

    //Read the data
    d3.csv("data/mobi_final_12_18.csv", function(data) {

        // ---------------------------//
        //     TITLE & AXIS & SCALE   //
        // ---------------------------//
        var colortitle =  ["#acadae"]
        var coloraxis =  ["#dce0e1"]
        var colorlegend = ["#5d6164"]

        svg_graph1.append("text")
            .attr("x", margin_descr1.left - 50)
            .attr("y", margin_descr1.top - 40)
            .attr("text-anchor", "left")
            .style("font-size", "22px")
            .style("text-decoration", "bold")
            .html("Choix modal et bassin de population")
            .style("text-decoration", "italic")
            .style("fill", colortitle)
            .style("letter-spacing", "-0.75px");




        svg_graph1.append("text")
            .attr("x", margin_descr1.left - 50)
            .attr("y", margin_descr1.top - 25)
            .attr("text-anchor", "left")
            .style("font-size", "12px")
            .style("text-decoration", "bold")
            .text("* survoler les bulles ci-dessous")
            .style("font-size", "12px")
            .style("fill", colorlegend)
            .style("text-decoration", "italic")
            .style("letter-spacing", "-0.9px");



        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 100])
            //.domain([10, 70])
            .range([0, width]);
        var xAxis = svg_graph1.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "axiscolor")
            .call(d3.axisBottom(x).ticks(4).tickSize(0))
            .selectAll("text")
            .attr("class", "axistick");
            //.style("text-anchor", "end")
            
            //.style("fill", coloraxis);
            //.style("stroke",coloraxis);
          
        // Add X axis label:
        svg_graph1.append("text")
            .attr("text-anchor", "end")
            .attr("x", width - 10)
            .attr("y", height - 12)
            .text("[%]Part des pendulaires en transport public")
            //.attr("text-anchor", "right")
            .style("font-size", "14px")
            .style("fill",colorlegend)
            .style("text-decoration", "italic")
            .style("letter-spacing", "-0.75px");

        // Add Y axis
        var y = d3.scaleLinear()
            //.domain([10, 70])
            .domain([0, 100])
            .range([height, 50]);
        //.range([height - (height / 4), 0 + (height / 7)]);
        var yAxis = svg_graph1.append("g")
            .attr("class", "axiscolor")
            .call(d3.axisLeft(y).ticks(5).tickSize(0).tickValues(["20","40","60","80","100"]))
            .selectAll("text")
            .attr("class", "axistick");

        // Add Y axis label:
        svg_graph1.append("text")
            .attr("text-anchor", "end")
            .attr("x", -250)
            .attr("y", -30)
            .text("[%]Part des pendulaires en auto")
            .attr("text-anchor", "start")
            //.attr("text-anchor", "right")
            .attr("transform", "rotate(-90)")
            .style("font-size", "14px")
            .style("text-decoration", "italic")
            .style("fill",colorlegend)
            .style("letter-spacing", "-0.75px");

            
        //------CLIP PATH POUR LE ZOOM------//
        var clip = svg_graph1.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // Add a scale for bubble size
        var z = d3.scaleSqrt()
            .domain([80000, 1400000])
            .range([10, 40]);

        // Add a scale for bubble color

        //mygroup = ["Zurich", "Berne", "Lucerne", "Bale", "St-Gall", "Lugano", "Lausanne", "Geneve"]
        mygroup = ["Zurich_ville", "Zurich_agglo", "Berne_ville", "Berne_agglo", "Lucerne_ville", "Lucerne_agglo", "Bale_ville", "Bale_agglo", "St-Gall_ville", "St-Gall_agglo", "Lugano_ville", "Lugano_agglo", "Lausanne_ville", "Lausanne_agglo", "Geneve_ville", "Geneve_agglo"]
        var myColor2 = d3.scaleOrdinal()
            .domain(mygroup)
            .range(["#457b9d", "#457b9d", "#e63946", "#e63946", "#48cae4", "#48cae4", "#2b2d42", "#2b2d42", "#006d77", "#006d77", "#b56576", "#b56576", "#52b788", "#52b788", "#ffcb77", "#ffcb77"]);

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
        var tooltip = d3.select("#descriptif1")
            .append("div")
            .style("opacity", 0)
            .attr("width", "100px")
            .attr("height", "100px")
            .attr("class", "tooltip_graph1")
            .style("background-color", "grey")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")

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
        // SCATTER VARIABLE POUR LE ZOOM 


     // Add brushing
        /*var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
        */
        var scatter = svg_graph1.append('g')
            .attr("clip-path", "url(#clip)")
        // Add dots
        scatter
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function(d) { return "bubbles1 " + d.cat })
            .attr("class", function(d) { return "bubbles2 " + d.cat2 })
            .attr("cx", function(d) { return x(d.tp_2018); })
            .attr("cy", function(d) { return y(d.Auto_18); })
            .attr("r", function(d) { return z(d.pop); })
            .style("fill", function(d) { return myColor2(d.villes); })
            //.style("stroke", function(d) { return mycolor_agglo(d.cat2); })
            .style("fill-opacity", 1)
            .attr("stroke", "grey")
            .style("stroke-width", 1.7)
            //.style('stroke-dasharray', '3,5')
            .attr("stroke-dasharray", function(d) {
                    if (d.cat2 === "Agglomeration") { //Threshold of 15
                        return "4,9";
                    } else {
                        return "0,0"
                    }
                })
            .style("stroke-linecap", "round")

            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
        


          // Add the brushing
        /*scatter
            .append("g")
            .attr("class", "brush")
            .call(brush);
        // A function that set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }
        */
        // ---------------------------//
        //       LEGENDES              //
        // ---------------------------//
        // meme échelle que variable bubble z plus haut 
        var size = d3.scaleSqrt()
            .domain([80000, 1400000]) // valeur max population à Zurich agglo
            .range([10, 40]) // taille max du cercle selon la correction de Flannery

        // Add legend: circles
        var valuesToShow = [100000, 800000, 1400000]
        var xCircle = 80
        var xLabel = 130
        var yCircle = 350
        
        svg_graph1
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d) { return yCircle - size(d) })
        .attr("r", function(d) { return size(d) })
        .style("fill", "none")
        .style("stroke", colorlegend)
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.75px");

    // Add legend: segments
    svg_graph1
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function(d) { return xCircle })
        .attr('x2', xLabel)
        .attr('y1', function(d) { return yCircle - size(d) * 2 })
        .attr('y2', function(d) { return yCircle - size(d) * 2 })
        .style('stroke-dasharray', ('2,2'))
        .style('stroke-dasharray', ('2,2'))
        .style("stroke", colorlegend)
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.75px");

    // Add legend: labels
    svg_graph1
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel + 5)
        .attr('y', function(d) { return yCircle - size(d) * 2 })
        .text(function(d) { return d3.format(",")(d) })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')
        .style("fill", colorlegend)
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.75px");

        /*svg_graph1
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
            .attr('y1', function(d) { return yCircle -100 - z(d) })
            .attr('y2', function(d) { return yCircle - 100 - z(d) })
            .style('stroke-dasharray', ('2,2'))
            .style("stroke", colorlegend)
            .style("text-decoration", "italic")
            .style("letter-spacing", "-0.75px");

        // Add legend: labels
        svg_graph1
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("text")
            .attr('x', xLabel)
            .attr('y', function(d) { return yCircle - 100 - z(d) })
            .text(function(d) { return d })
            .style("font-size", 11)
            .attr('alignment-baseline', 'middle')
            .style("fill", colorlegend)
            .style("text-decoration", "italic")
            .style("letter-spacing", "-0.75px");*/

        // Legend title
        svg_graph1.append("text")
            .attr('x', xCircle/2)
            .attr("y", yCircle - 97)
            .text("Nombre d'habitants")
            .attr("text-anchor", "center")
            .style("font-size", "12px")
            .style("fill", colorlegend)
            .style("text-decoration", "italic")
            .style("letter-spacing", "-0.75px");


        // ---------------------------//
        //     Légendes de catégories des VILLEs //
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
            .attr("cy", function(d, i) { return 30 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
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
            .attr("y", function(d, i) { return 20 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d) { return myColor(d) })
            .style("stroke", "black")
            .style("stroke-width", "0.09")
            .text(function(d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "17px")
            .style("text-decoration", "italic")
            .style("letter-spacing", "-0.75px")
            .on("mouseover", highlight1)
            .on("mouseleave", noHighlight1);




        // ---------------------------//
        //     Légendes de catégories des agglos et villes-centre //
        // ---------------------------//

        
        var mycolor_dash = d3.scaleOrdinal()
        .domain(["Agglomeration", "Ville-centre"])
        //.range(["#000", "#7A7A7A"]);
        .range(["1,3", "0,0"]);//specs trait-tillés

        // Add one dot in the legend for each name.
        var size = 20
        var allgroups = ["Ville-centre", "Agglomeration"]
        svg_graph1.selectAll("myrect2")
            .data(allgroups)
            .enter()
            .append("circle")
            .attr("cx", 300)
            .attr("cy", function(d, i) { return 30 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 11)
            //.style("fill", function(d) { return mycolor_agglo(d) })
            .style("stroke-dasharray", function(d) { return mycolor_dash(d) })
            .attr("stroke", "grey")
            .style("fill", "none")
            .style("stroke-width", 1.5)
            .style("stroke-linecap", "round")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)



        // Add labels beside legend dots
        svg_graph1.selectAll("mylabels2")
            .data(allgroups)
            .enter()
            .append("text")
            .attr("x", 300 + size * .8)
            .attr("y", function(d, i) { return 20 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", colorlegend)
            .text(function(d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
    

    //-------PARAMETRES DU ZOOM DANS LE GRAPH------//
    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    /*var zoom = d3.zoom()
        .scaleExtent([.5, 5]) // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", updateChart);

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    svg_graph1.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin_descr1.left + ',' + margin_descr1.top + ')')
        .call(zoom); */
    // now the user can zoom and it will trigger the function called updateChart

    // A function that updates the chart when the user zoom and thus new boundaries are available
        
    /*function updateChart() {

            extent = d3.event.selection
        
            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain([0,100])
            }else{
            x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
            scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }
        
            // Update axis and circle position
            xAxis.transition().duration(1000).call(d3.axisBottom(x))
            scatter
            .selectAll("circle")
            .transition().duration(1000)
            .attr("cx", function (d) { return x(d.tp_2018); } )
            .attr("cy", function (d) { return y(d.Auto18); } )
        
        }
    function updateChart() {

        // recover the new scale
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);

        // update axes with these new boundaries
        xAxis.call(d3.axisBottom(newX))
        yAxis.call(d3.axisLeft(newY))

        // update circle position
        scatter
            .selectAll("circle")
            .attr("cx", function(d) { return newX(d.tp_2018)})
            .attr("cy", function(d) { return newY(d.Auto18)});
            

          
        }*/
    })

}
bubble_chart();