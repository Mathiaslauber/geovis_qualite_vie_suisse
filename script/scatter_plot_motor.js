// set the dimensions and margins of the graph

function scatter_plot_motor() {
    let margin_graph1 = { top: 50, right: 15, bottom: 40, left: 60 },
        width = 650 - margin_graph1.left - margin_graph1.right,
        height = 400 - margin_graph1.top - margin_graph1.bottom;

    // append the svg object to the body of the page
    var svg_motor = d3.select("#graph1")
        .append("svg")
        .attr("width", width + margin_graph1.left + margin_graph1.right)
        .attr("height", height + margin_graph1.top + margin_graph1.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin_graph1.left + "," + margin_graph1.top + ")");

    //Read the data
    d3.csv("data/scatter_connected_tx_motor.csv", function(data) {
        var colortitle =  ["#acadae"]
        var coloraxis =  ["#dce0e1"]
        var colorlegend = ["#5d6164"]
        // List of groups (here I have one group per column)

        // var allGroup = ["Zurich_ville", "Zurich_agglo", "Berne_ville"]
        // var allGroup = ["ZH_ville", "ZH_agglo", "BE_ville", "BE_agglo", "LUC_ville", "LUC_agglo", "BS_ville", "BS_agglo", "SG_ville", "SG_agglo", "LUG_ville", "LUG_agglo", "LAU_ville", "LAU_agglo", "GE_ville", "GE_agglo"]
        var allGroup = ["ZH_ville", "BE_ville", "LUC_ville", "BS_ville", "SG_ville", "LUG_ville", "LAU_ville", "GE_ville"]
            //year1,time,ZH_ville,ZH_agglo,BE_ville,BE_agglo,LUC_ville,LUC_agglo,BS_ville,BS_agglo,SG_ville,SG_agglo,LUG_ville,LUG_agglo,LAU_ville,LAU_agglo,GE_ville,GE_agglo

        // Reformat the data: we need an array of arrays of {x, y} tuples
        var dataReady = allGroup.map(function(grpName) { // .map allows to do something for each element of the list
            return {
                name: grpName,
                values: data.map(function(d) {
                    return { time: d.time, value: +d[grpName] };
                })
            };
        });
        // I strongly advise to have a look to dataReady with
        // console.log(dataReady)

        // A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(["#457b9d", "#e63946", "#48cae4", "#2b2d42", "#006d77", "#b56576", "#52b788", "#ffcb77"]);

        //.range(["#457b9d", "#457b9d", "#e63946", "#e63946", "#48cae4", "#48cae4", "#2b2d42", "#2b2d42", "#006d77", "#006d77", "#b56576", "#b56576", "#52b788", "#52b788", "#ffcb77", "#ffcb77"]);
        //.range(d3.schemeSet2);

        //-------TITRAILLE-----//

        svg_motor.append("text")
            .attr("x", margin_graph1.left * 2.5)
            .attr("y", 20 - (margin_graph1.top))
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "bold")
            .text("Evolution de la motorisation")
            .style("text-decoration", "italic")
            .style("fill", colortitle)
            .style("letter-spacing", "-0.75px");


        svg_motor.append("text")
            .attr("x", margin_graph1.left * 2.5 - 15)
            .attr("y", 15 - (margin_graph1.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("text-decoration", "italic")
            .style("fill", colortitle)
            .text("Nombre de voitures pour 1000 hab.");


        svg_motor.append("text")
            .attr("x", "70%")
            .attr("y", -10)
            .attr("text-anchor", "left")
            .style("font-size", "12px")
            .style("fill", colorlegend)
            .style("text-decoration", "italic")
            .style("letter-spacing", "-0.9px")
            //.style("text-decoration", "bold")
            .text("à cocher")
            .style("fill", colorlegend);

        // Add X axis --> it is a date format

        var x = d3.scaleLinear()
            .domain([0, 10])
            .range([0, width - (width / 6)]);
        let xAxisGenerator = d3.axisBottom(x);
        xAxisGenerator.ticks(7);
        xAxisGenerator.tickValues([1, 2, 3, 4, 5, 6, 7]);
        let tickLabels = ['2011', '2012', '2014', '2015', '2016', '2017', '2018'];
        xAxisGenerator.tickFormat((d, i) => tickLabels[i]);
        xAxisGenerator.tickSize(0)
            //xAxisGenerator.tickLine("stroke-dasharray", "2,2");



        let xAxis = svg_motor.append("g")
            .call(xAxisGenerator)
            .attr("class", "axiscolor");
        //.ticks(7)          
        xAxis.attr("transform", "translate(0," + height + ")");
        xAxis.selectAll(".tick text")
            .attr("y", +10)
            //.attr("font-size", "14")
            //.attr("font-family", "Comfortaa")
            .attr("class", "axiscolor");
            
        xAxis.selectAll("text")
        .attr("class", "axistick");

        /*   
           var x = d3.scaleLinear()
               .domain(d3.extent(data, function(d) { return d.year1; }))
               .range([0, width]);
           svg.append("g")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x).ticks(7));
           */

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([200, 650])
            .range([height, 0])
        var yAxis = svg_motor.append("g")
            .call(d3.axisLeft(y).tickValues(["300", "450", "600"]).tickSize(0))
            .attr("class", "axiscolor");


        yAxis.selectAll(".tick text")
            //.attr("font-size", "12")
            //.attr("font-family", "Comfortaa")
            .attr("class", "axistick");


        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg_motor.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // Create the scatter variable: where both the circles and the brush take place
        var lines = svg_motor.append('g')
            .attr("clip-path", "url(#clip)")

        // Add the lines
        line = d3.line()
            .x(function(d) { return x(+d.time) })
            .y(function(d) { return y(+d.value) })
        lines
            .selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
            .attr("class", function(d) { return d.name })
            .attr("d", function(d) { return line(d.values) })
            .attr("stroke", function(d) { return myColor(d.name) })
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("opacity", "0.05")




        // Create the scatter variable: where both the circles and the brush take place
        var scatter = svg_motor.append('g')
            .attr("clip-path", "url(#clip)")

        // Add the points


        scatter
        // First we need to enter in a group
            .selectAll("myDots")
            .data(dataReady)
            .enter()
            .append('g')
            .style("fill", function(d) { return myColor(d.name) })
            .attr("class", function(d) { return d.name })
            // Second we need to enter in the 'values' part of this group
            .selectAll("myPoints")
            .data(function(d) { return d.values })
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.time) })
            .attr("cy", function(d) { return y(d.value) })
            .attr("r", 4)
            .attr("stroke", "white")
            .style("opacity", "0.4")

        // Add a label at the end of each line
        svg_motor
            .selectAll("myLabels")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .attr("class", function(d) { return d.name })
            .datum(function(d) { return { name: d.name, value: d.values[d.values.length - 1] }; }) // keep only the last value of each time series
            .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
            .attr("x", 30) // shift the text a bit more right
            .style("opacity", "0.05")

        //.attr("transform", "rotate(-30)")
        .text(function(d) { return d.name; })
            .style("fill", function(d) { return myColor(d.name) })
            .style("font-size", 15)




        /* var size = 20
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
             .on("mouseleave", noHighlight1);*/

    



        // CARRES LEGENDES -------------------------------------------------------------

        svg_motor
            .selectAll("myLegend_labels")
            .data(dataReady)
            //.data(allgroups)
            .enter()
            .append('g')
            .append('text')
            .attr('font-family', 'FontAwesome')
            .attr('font-size', function(d) { return d.size+'em'} )
            .text(function(d) { return '\uf245' })
            .attr('x', 460)
            .attr('y', function(d, i) { return 10 + i * 40 })
            .attr("height", 30)
            .attr("width", 30)
            //.style("fill", function(d) { return myColor(d.name) })
            .style("fill", "#d1d1d1")
            .style("stroke", "grey")
            .on("click", function(d) {
                // is the element currently visible ?
                currentOpacity = d3.selectAll("." + d.name).style("opacity")
                    // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll("." + d.name).transition(100).style("opacity", currentOpacity == 1 ? 0.2 : 1)

            })
            .on("dblclick", function(d) {
                d3.selectAll("." + d.name).transition(100).style("opacity", "0")
            })


        // NOM DES LABELS -----------------------------------------

        var myColor = d3.scaleOrdinal()
            .domain(["Zurich", "Berne", "Lucerne", "Bale", "St-Gall", "Lugano", "Lausanne", "Geneve"])
            //.domain(mygroup)
            .range(["#457b9d", "#e63946", "#48cae4", "#2b2d42", "#006d77", "#b56576", "#52b788", "#ffcb77"]);


        var colorlab = ["#457b9d", "#e63946", "#48cae4", "#2b2d42", "#006d77", "#b56576", "#52b788", "#ffcb77"]
            //var size = 40
        var allgroups = ["Zurich", "Berne", "Lucerne", "Bale", "St-Gall", "Lugano", "Lausanne", "Geneve"]
            // Add labels beside legend dots
        svg_motor.selectAll("mylabels")
            .data(allgroups)
            .enter()
            .append("text")
            .attr('x', 500)
            .attr('y', function(d, i) { return 25 + i * 40 })
            //.attr("x", 400 + size * .8)
            //.attr("y", function(d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d) { return myColor(d) })
            //.style("fill", "black")
            .style("stroke", "black")
            .style("stroke-width", "0.09")
            .text(function(d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "19px")
            .style("text-decoration", "italic")
            .style("letter-spacing", "-0.75px")

        /*
        svg_motor
            .selectAll("myLegend")
            .data(dataReady)
            //.data(allgroups)
            .enter()
            .append('g')
            .append("text")
            .attr('x', 400)
            .attr('y', function(d, i) { return 20 + i * 60 })
            //.text(function(d) { return d.name; })
            .text(function(d) { return allgroups; })
            //.style("fill", function(d) { return myColor(d.name) })
            .style("font-size", 20)
            .on("click", function(d) {
                // is the element currently visible ?
                currentOpacity = d3.selectAll("." + d.name).style("opacity")
                    // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll("." + d.name).transition(100).style("opacity", currentOpacity == 1 ? 0.2 : 1)

            })
            .on("dblclick", function(d) {
                d3.selectAll("." + d.name).transition(100).style("opacity", "0")
            })


            */

        /*   // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
        var zoom = d3.zoom()
            .scaleExtent([.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("zoom", updateChart);

        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);
        // now the user can zoom and it will trigger the function called updateChart

        // A function that updates the chart when the user zoom and thus new boundaries are available
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
                .attr("cx", function(d) { return newX(d.time) })
                .attr("cy", function(d) { return newY(d.value) });

            lines
                .selectAll("line")
                .x(function(d) { return newX(+d.time) })
                .y(function(d) { return newY(+d.value) })
        }*/
    })
}
scatter_plot_motor();