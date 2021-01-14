// ------------------------------------------------
//------------CE QU'IL RESTE À FAIRE : 
//  [x] faire un hover effect avec la légende couleur
//  [x] faire un tooltip éventuellement avec graph (tableau, actuellement)
//  [] mettre les % de la légende à l'arrête de sa box
//  [x] faire un tableau dans le tooltip
//
//
//
//



// Define the div for the tooltip
/*
var div = d3.select("#tooltip").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);*/

function map_symbol() {

    var map = L.map("mapdiv", { center: [46.6, 7.95], zoom: 8 });
    map.setMaxBounds([
        [45.989329, 5.98],
        [47.413155, 10.538028]
    ]);
    map.setMinZoom(8);
    


    // Définir les différentes couches de base:
    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    var osmNoirBlanc = L.tileLayer(
        'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }
    );
    var mapboxStreets = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2thaXNlciIsImEiOiJaS2cxcmVzIn0.IVsFCwYP0dpDlCdpsAGEcQ', {
            attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors'
        }
    );
    var esriImagery = L.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="http://www.esri.com">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
    );
    var myMapbox = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mathiaslauber/ck2kaig6q0bp71ctivdduc3aw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF0aGlhc2xhdWJlciIsImEiOiJjazJrYWhkb3IwZHFhM21xcGxrdG80a2s3In0.WOEWDNFeMHLJpOq-KdC6ew', {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }
    );
    var myMapbox2 = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mathiaslauber/ckgt7ofrp1why19n8boge39u7/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF0aGlhc2xhdWJlciIsImEiOiJjazJrYWhkb3IwZHFhM21xcGxrdG80a2s3In0.WOEWDNFeMHLJpOq-KdC6ew', {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }
    );
    // Ajouter la couche de base par défaut à la carte.
    //api.mapbox.com/styles/v1/mathiaslauber/ckgt7ofrp1why19n8boge39u7.html?fresh=true&title=copy&access_token=pk.eyJ1IjoibWF0aGlhc2xhdWJlciIsImEiOiJjazJrYWhkb3IwZHFhM21xcGxrdG80a2s3In0.WOEWDNFeMHLJpOq-KdC6ew
    myMapbox2.addTo(map);


    // Créer les boutons pour changer la couche de base
    var baseLayers = {
        "Carte": myMapbox2,
        "Photos aériennes": esriImagery,
        "Filigrane vert": myMapbox,
        "Mapbox streets": mapboxStreets,
        "Openstreetmap": osmLayer,
        "OpenStreetmap,noirblanc": osmNoirBlanc,
    };
    var overlays = {};
    L.control.layers(baseLayers, overlays).addTo(map);


    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//
    // regarder overstack flow pour le problème de tooltip 

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#tooltip_map")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip_map")
        .style("background-color", "grey")
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
            .html("<table>" + "<thead>" + "<tr>" + "<th>Lieu :</th>" + "<th>population</th>" + "<th>% vacance</th>" + "<th>Nombre logements</th>" + "</tr>" + "</thead>" + "<tbody>" + "<tr>" + "<td>" + d.name + "</td>" + "<td>" + d.pop + "</td>" + "<td>" + d.log_vac_moy + "</td>" + "<td>" + d.log_tot_moy + "</td>" + "</tr>" + "</tbody>" + "</table>")
            //"Il s'agit de la ville de : " + d.name + )
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var moveTooltip = function(d) {
        tooltip
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var hideTooltip = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // create a colorscale
    var color = d3.scaleOrdinal()
        .domain(["a", "b", "c", "d", "e"])
        .range(["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"])

    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function(d) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", .05)
            // expect the one that is hovered
        d3.selectAll("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d) {
            d3.selectAll(".bubbles").style("opacity", 1)
        }
        //colorbrew
        //M.brew.setSeries(M.dataSeries);
        // toutes les valeurs entre 2014 et 2019
    brew = new classyBrew();
    //map.brew.setSeries(map.dataSeries);
    brew.setSeries([0.2, 0.8, 0.5, 1, 0.9, 0.8, 0.2, 0.5, 1.5, 1.5, 0.7, 0.7, 0.1, 0.4, 0.4, 0.5, 0.2, 0.8, 0.4, 1, 0.8, 0.9, 0.3, 0.6, 2, 1.9, 0.8, 0.8, 0.1, 0.4, 0.5, 0.5, 0.2, 0.9, 0.4, 1.4, 1, 1, 0.4, 0.7, 1.9, 1.8, 1.2, 1, 0.3, 0.5, 0.5, 0.5, 0.2, 0.9, 0.6, 1.3, 1, 1.1, 0.5, 0.8, 1.8, 1.9, 1.2, 1.3, 0.4, 0.6, 0.6, 0.6, 0.2, 1, 0.4, 1.2, 1, 1.5, 0.7, 1, 2.3, 2.2, 2.2, 2, 0.7, 0.7, 0.6, 0.6, 0.1, 0.9, 0.6, 1.3, 1.3, 1.4, 1, 1.2, 2.5, 2.3, 2.7, 2.3, 0.4, 0.7, 0.6, 0.6]);
    brew.setNumClasses(5);
    brew.setColorCode('PuBu');
    breaks = brew.classify('jenks');
    /*map.color = d3.scaleThreshold()
        .domain(map.breaks.slice(1, 6))
        .range(map.brew.getColors());*/

    brew.getBreaks(); // returns 0.1, 0.4, 0.7, 1.1, 1.5, 2.7
    brew.getColors(); // returns "rgb(241,238,246)", "rgb(189,201,225)", "rgb(116,169,207)", "rgb(43,140,190)", "rgb(4,90,141)"
    //      #f1eef6 #bdc9e1 #74a9cf #2b8cbe #045a8d


    var cities = [];
    var citiesOverlay = L.d3SvgOverlay(function(selection, projection) {

        selection
            .selectAll('circle')
            .data(cities)
            .enter()
            .append('circle');

        selection
            .selectAll('circle')
            .data(cities)
            .attr('r', function(d) { return Math.max(Math.pow(d.log_tot_moy, 0.57) / 40, 2); })
            .attr('cx', function(d) { return projection.latLngToLayerPoint([d.lat, d.lng]).x; })
            .attr('cy', function(d) { return projection.latLngToLayerPoint([d.lat, d.lng]).y; })
            .attr("class", function(d) { return "bubbles " + d.group })
            .attr('stroke', 'white')
            .attr('stroke-width', function(d) { return 1.2 / projection.scale; })
            .style("fill", function(d) { return color(d.group) })
            //.attr("stroke", function(d) { return color(d.group) })
            .attr("stroke", "#FFFF")
            .attr("stroke-width", 1)
            .attr("fill-opacity", .9)
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
            /*.on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("concerne : " + d.name + "et " + d.log_tot_moy + " automobiles")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 20) + "px");
            }) AUTRE TOOLTIP
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });*/


        /*.attr('fill', function(d) {
            return M.data[d.properties.id] ?
                M.color(M.data[d.properties.id].p_fem_singl_2034) :
                '#fff';*/
    })


    //.attr('fill', function(d) { return (d.group == 'town') ? "orange" : "grey"; });


    /*// Modifer l'ordre des symboles
    d3.csv("data.csv", function(d) {
        d.pop = (d.pop == "") ? 0 : +d.pop;
        return d;

    }).then(function(data1) {
        cities = data1;
        cities.sort(function(a, b) {
            return (a.pop > b.pop) ? -1 : ((b.pop > a.pop) ? 1 : 0);

        });*/
    // attention mention de d.pop plus haut 
    // Modifer l'ordre des symboles
    /*VERSION OBSOLETE AVEC D3.js V4
    d3.csv("data/data.csv", function(d) {
        d.log_tot_moy = (d.log_tot_moy == "") ? 0 : +d.log_tot_moy;
        return d;

    }).then(function(data1) {
        cities = data1;
        cities.sort(function(a, b) {
            return (a.log_tot_moy > b.log_tot_moy) ? -1 : ((b.log_tot_moy > a.log_tot_moy) ? 1 : 0);

        });


    })
    citiesOverlay.addTo(map);*/

    // VERSION moins optimisée mais compatible d3.js v4
    d3.csv("data/data.csv", function(data) {
        cities = data;
        cities.sort(function(a, b) {
            var p = parseInt(a.log_tot_moy);
            var q = parseInt(b.log_tot_moy);
            return (p > q) ? -1 : ((q > p) ? 1 : 0);
        });
        citiesOverlay.addTo(map);
    })



    // set the dimensions and margins of the graph
    let margin_map = { top: 0, right: 0, bottom: 0, left: 5 },
        width = 900 - margin_map.left - margin_map.right,
        height = 630 - margin_map.top - margin_map.bottom;

    // append the svg object to the body of the page
    var svg_chorop = d3.select("#sidebar")
        .append("svg")
        .attr("width", width + margin_map.left + margin_map.right)
        .attr("height", height + margin_map.top + margin_map.bottom)
        .append("g")
        //.style("stroke", "red")
        //.style("fill", "red")
        .attr("transform",
            "translate(" + margin_map.left + "," + margin_map.top + ")");
    /*
    // création d'un SVG aux dimensions du side bar
    var margin1 = { top: 90, right: 0, bottom: 0, left: 760 },
        width = 330 - margin1.left - margin1.right,
        height = 620 - margin1.top - margin1.bottom;

    var svg_chorop = d3.select("#sidebar")
        .append("svg_chorop")
        .attr("width", width + margin1.left + margin1.right)
        .attr("height", height + margin1.top + margin1.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin1.left + "," + margin1.top + ")")
        .style("stroke", "red")
        .style("fill", "red");*/
    var mycolor = d3.scaleOrdinal()
        .domain(["e", "d", "c", "b", "a"])
        .range(["#045a8d", "#2b8cbe", "#74a9cf", "#bdc9e1", "#f1eef6"])
        //.range(["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"])

    d3.csv("data/data.csv", function(d) {

        //------------------------------------------------------//
        //-------LEGENDE COULEUR CHOROPLETHE-------------------//
        //----------------------------------------------------//
        var size = 30
        var allgroups = ["e", "d", "c", "b", "a"]
        var keys = ["max : 2.7", "1.5", "1.1", "0.7", "0.4"]
            //0.1, 0.4, 0.7, 1.1, 1.5, 2.7

        svg_chorop.selectAll("mydots")
            .data(allgroups)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function(d, i) { return 60 + i * (size + 10) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d) { return mycolor(d) })
            .style("stroke", "#DCDCDC")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
            //.on("mouseover", highlight)
            //.on("mouseleave", noHighlight)


        // Add one dot in the legend for each name.
        svg_chorop.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 0 + size * 1.2)
            .attr("y", function(d, i) { return 50 + i * (size + 10) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", "black")
            .text(function(d) { return d })
            .style("font-size", "16px")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
            //.on("mouseover", highlight)
            //.on("mouseleave", noHighlight)


        svg_chorop.append("text").attr("x", 35).attr("y", 250).text("min : 0.1").style("font-size", "12px").attr("alignment-baseline", "middle")
        svg_chorop.append("text").attr("x", 0).attr("y", 15).text("[%] de logements vacants").style("font-size", "19px").attr("alignment-baseline", "middle")
        svg_chorop.append("text").attr("x", 0).attr("y", 35).text("moyenne entre 2014-2019").style("font-size", "14px").attr("alignment-baseline", "middle")
            // ------------------------------------------------------------//
            //      CERCLE TAILLE : LEGENDES NOMBRE DE LOGEMENTS TOTAUX   //
            // ----------------------------------------------------------//
            //var valuesToShow = ["50'000", "150'000", "300'000", "600'000"]
            //50000;150000;300000;600000
            // The scale you use for bubble size
        var size = d3.scaleSqrt()
            .domain([0, 661505]) // valeur max correspond à Zurich agglo
            .range([1, 52]) // taille max du cercle selon la correction de Flannery

        // Add legend: circles
        var valuesToShow = [50000, 150000, 300000, 600000]
        var xCircle = 221
        var xLabel = 291
        var yCircle = 175
        svg_chorop
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("circle")
            .attr("cx", xCircle)
            .attr("cy", function(d) { return yCircle - size(d) })
            .attr("r", function(d) { return size(d) })
            .style("fill", "none")
            .attr("stroke", "black")

        // Add legend: segments
        svg_chorop
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("line")
            .attr('x1', function(d) { return xCircle })
            .attr('x2', xLabel)
            .attr('y1', function(d) { return yCircle - size(d) * 2 })
            .attr('y2', function(d) { return yCircle - size(d) * 2 })
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))

        // Add legend: labels
        svg_chorop
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("text")
            .attr('x', xLabel + 5)
            .attr('y', function(d) { return yCircle - size(d) * 2 })
            .text(function(d) { return d3.format(",")(d) })
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle')

        // Legend title
        svg_chorop.append("text")
            .attr('x', xCircle - 50)
            .attr("y", yCircle + 25)
            .text("Nombre de logements")
            .attr("text-anchor", "right")
            .attr("font-size", "17")

        svg_chorop.append("text")
            .attr('x', xCircle - 50)
            .attr("y", yCircle + 45)
            .text("moyenne entre 2014-2019")
            .attr("text-anchor", "right")
            .attr("font-style", "italic")
            .attr("font-size", "14px")





    })
}
map_symbol();