function initChart(gameId, cardId, isBlank){    //initialize donut/pie charts for Card, draw in place
    let chartData = "";
    if(isBlank) chartData = "0_0";
    else chartData = gameId + "_" + cardId;
      
    let width = 100,
        height = 100,
        radius = Math.min(width, height) / 2;

    let color = d3.scale.category20();

    //define and set init value
    let pie = d3.layout.pie()
        .value(function(d) { return d.v0_0; })         
        .sort(null);

    let arc = d3.svg.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius * 0.92);

    //add SVG chart to DOM
    let svgLocation = "#graphic" + gameId + "_" + cardId;
    document.getElementById("graphic" + gameId + "_" + cardId).innerHTML = "";
    let svg = d3.select(svgLocation).append("svg")
        .attr("viewBox", "-60 -60 120 120");

    //load tsv file with chart data
    d3.tsv("data4.tsv?v2", type, function(error, data) {
        if (error) throw error;
        
        let path = svg.datum(data).selectAll("path")
            .data(pie)
            .enter().append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc)
            .each(function(d) { this._current = d; }); // store the initial angles

        if(chartData != "0_0") {
            change(chartData);
        }
        
        function change(chartData) {    //update value and redraw chart
            let value = "v"+chartData;  
            pie.value(function(d) { return d[value]; }); // change the value function
            path = path.data(pie); // compute the new angles
            path.transition().duration(500).delay(1500).attrTween("d", arcTween); // redraw the arcs
        }
    });

    function type(d) {  //convert data to numeric
        d.v0_0 = +d.v0_0;
        d.v1_1 = +d.v1_1;
        d.v1_4 = +d.v1_4;
        d.v2_2 = +d.v2_2;
        d.v2_4 = +d.v2_4;
        return d;
    }

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
        let i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
        return arc(i(t));
        };
    }

}

function initPic(thisGame, thisCard) {    //initialize image and add to DOM for Card
    let thisCtr = document.getElementById("graphic" + thisGame + "_" + thisCard);
    let picBlock = document.createElement("IMG");
    picBlock.classList.add("staticPic");
    picBlock.setAttribute("src", "images/" + thisGame + "_" + thisCard + ".png");
    thisCtr.appendChild(picBlock);
}