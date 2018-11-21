
BarChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
}

BarChart.prototype.initVis = function(){
    var vis = this;

    //margins and sizing
    vis.margin = { top: 20, right: 10, bottom: 50, left: 200 };


    vis.width = 550 - vis.margin.left - vis.margin.right,
        vis.height = 350 - vis.margin.top - vis.margin.bottom;

    //create the svg area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // Scales and axes
    vis.x = d3.scaleLinear()
        .range([0, vis.width]);

    vis.y = d3.scaleBand()
        .rangeRound([vis.height, 0])
        .paddingInner(0.1);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.updateVis(vis.data);
}



//bar chart drawing function
BarChart.prototype.updateVis = function(data){
    var vis = this;
    var currentYear= d3.select("#wash_selected_value").property("value");

//update the domains
    vis.y.domain(data.map(function(d) { return d.UNICEF_beneficiaries; }));
    vis.x.domain([0, d3.max(data, function(d) {
        return d.year2015; })]); //fixed to the 2015 data so that the bars 'grow' when the year changes rather than the axis dynamically updating

//draw the bar chart
    vis.barChart = vis.svg.selectAll("rect")
        .data(data);

    vis.barChart.enter().append("rect")
        .attr("class", "bar")

        .merge(vis.barChart)
        .transition()
        .duration(1000)
        .attr("fill", "#1A237E")
        .attr("x", 0)
        .attr("y", function(d){
            return vis.y(d.UNICEF_beneficiaries);
        })
        .attr("height", vis.y.bandwidth())
        .attr("width", function(d){
            return vis.x(d[currentYear]);
        });

    vis.barChart.exit().remove();

// Update the axis
    vis.svg.select(".y-axis")
        .transition()
        .duration(1000)
        .call(vis.yAxis);

    vis.svg.select(".x-axis")
        .transition()
        .duration(1000)
        .call(vis.xAxis);

    vis.svg.append("text")
        .attr("transform",
            "translate(" + (vis.width/2) + " ," +
            (vis.height+vis.margin.bottom-7) + ")")
        .style("text-anchor", "middle")
        .attr("fill", "white")
        .text("WASH Beneficiaries (millions of people)");

}

