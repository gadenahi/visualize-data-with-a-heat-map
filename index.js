const w = 1200;
const h = 550;
const padding = 100;
const DATA_FILE_PATH = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
const baseTemperature = 8.66;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"]

d3.json(DATA_FILE_PATH, function(error, dataoriginal) {
  
  let yearparser = d3.timeParse("%Y");
  let yearformat = d3.timeFormat("%Y");  
  
  const monthlyVariance = dataoriginal.monthlyVariance;  // Used for rect
  const legendVals = (1/11*14);
  const length = dataoriginal.monthlyVariance.length;
  
  let dataset = monthlyVariance.map(function(d) {
    return {year: yearparser(d.year), month: d.month, variance: d.variance}
  })
  

  const xScale = d3.scaleTime()  //Need to use scaleTime for the time scale, not scaleLinear
                   .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
                   .range([padding, w - padding]);  
  
  const yScale = d3.scaleBand()　　//not scaleLinear 
                   .domain(months)
                   .range([padding, h-padding])
  
  const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class", "graph")
  
  svg.selectAll("rect")
     .data(dataset)  //changed to dataset
     .enter()
     .append("rect")
     .attr("class", "cell")  
     .attr("data-year", (d, i) => monthlyVariance[i].year)
     .attr("data-month", (d, i) => (d.month - 1))
     .attr("data-temp", (d, i) => d.variance + baseTemperature)
     .attr("x", (d, i) => xScale(d.year))  
     .attr("y", (d, i) => yScale(months[d.month - 1]))   
     .attr("width", (w - padding*2)/length*12)
     .attr("height", (h - padding*2)/12) 
     .attr("fill", (d, i) => colors[Math.floor((d.variance + baseTemperature) / 14 * 11)])
     .on("mouseover", function(d, i) {
      d3.select(".js_toolTip")
        .html(monthlyVariance[i].year + "-" + months[d.month - 1] + "<br>" + Math.round((d.variance + baseTemperature)*10)/10 + "℃" + "<br>" + (d.variance).toFixed(1) + "℃")
        .style("display", "inline-block")
        .style("top", yScale(months[d.month - 1]) + "px")
        .style("left", xScale(d.year) + "px")
        .attr("id", "tooltip")
        .attr("data-year", monthlyVariance[i].year)
      d3.select(this)
        .attr("stroke", "black") 
  })
     .on("mouseout", function(d, i) {
      d3.select(".js_toolTip")
        .style("display", "none")    
      d3.select(this)
        .attr("stroke", "none")
  })  

  svg.append("text")
     .attr("class", "y-label")
     .text("Months")
     .attr("x", -250)
     .attr("y", 50)
     .attr("transform", "rotate(-90)")  

  svg.append("text")
     .attr("class", "x-label")
     .text("Years")
     .attr("x", 500)
     .attr("y", 500)    
  
  const xAxis = d3.axisBottom(xScale)
                  .ticks(20)
                  .tickFormat(yearformat)

  const yAxis = d3.axisLeft(yScale)  

  svg.append("g")
     .attr("transform", "translate(0," + (h-padding) + ")")
     .attr("id", "x-axis")
     .call(xAxis)

  svg.append("g")
     .attr("id", "y-axis")
     .attr("transform", "translate(" + (padding) + ", 0)")
     .call(yAxis)  

  const legend = svg.selectAll(".legends")
                    .data(colors)
                    .enter()
                    .append('g')
                    .attr("id", "legend")
  
  legend.append('rect')
        .attr("x", (d, i) => w - padding - 25*colors.length + (i *25))
	      .attr("y", 490)
	      .attr("width", 20)
	      .attr("height", 10)
	      .attr("fill", (d, i) => colors[i])  
  
  legend.append('text') 
	      .attr("x", (d, i) => w - padding - 26*colors.length + (i *25))
	      .attr("y", 510)
        .text(function (d, i) {return (legendVals * (i)).toFixed(1) })
	      .style("font-size", 10)  
})