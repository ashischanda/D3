var margin = { top: 50, right: 300, bottom: 50, left: 145 },// Set your margin. Suppose, if you extend left value, the scatter graph will go at left
    outerWidth = 1250,         // define your canvas size for plotting graph
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();
var fileName = "data.csv";

// loading data  based on column values
d3.csv(fileName, function(data) {	
	var legend_text = ["GDP <= 0.40%","GDP > 0.40%", "Population:" ,"num <10 M", "num >10 M"];
	var legend_shape= ["circle", "circle", "dot", "circle", "circle"];
	var legend_shapeColor= ["red", "green", 'black', 'black', 'black'];
	var legend_shapeSize = [100, 100, 1, 50, 100];
	
	var textcolors = ['blue', 'blue','blue', 'black', 'black', 'black','blue','blue','blue'];
	  
	  // this function checks all value from csv file
	  data.forEach(function(d) {
		// Casting process // converting string data to integer 
		// LOOK, we are not using  +=
		d.day = +d.day;	        // *******************   X axis values	
		d.y_data = + d.y_data;  // *******************   Y axis values				
		d.weight = +d.weight;	
	  });
	  // ************* end of data checking 
	 
	  // setting the max and min value of axis to show in Scatter graph
	  var xMax = d3.max(data, function(d) { return d.day; }) * 1.05,	// choosing max "Calories"
		  xMin = d3.min(data, function(d) { return d.day; }),
		 
		  yMax = d3.max(data, function(d) { return d.y_data; }) * 1.05,
		  yMin = d3.min(data, function(d) { return d.y_data.valueOf(); });
	
	

	  x.domain([xMin, xMax]);
	  y.domain([yMin-0.3, yMax]);

	  xAxisText = ['4/24','4/25', '4/26', '4/27','4/28','4/29','4/30','4/31', '5/1', '5/2','5/3','5/4','5/5', '5/8' , '5/9', '5/10', '5/13', '5/14','5/15'];
	  yAxisText = ['PA','NY', 'WA','TX', 'VG', 'NC','CA','NV','AZ']
	  xAxisInst = ['414','400', '414', '400','400', '414', '400','400', '414', '400','400', '414', '400','400', '414', '400','400', '414', '400'];
	  
	  
	  var xAxis = d3.svg.axis()
		  .scale(x)
		  .orient("bottom")
		  .ticks(20)	                    // number of xAxis ticker 
		  .tickFormat(function (d, i) {
				return xAxisText[d]; 		// adding ticker at x label
			})		 
		 .tickPadding(4)
		 .tickSize(-height);

	  var yAxis = d3.svg.axis()
		  .scale(y)
		  .orient("left")
		  .ticks( 10 )			           // number of xAxis ticker
		  .tickFormat(function (d, i) {
				return yAxisText[d];       // adding ticker at Y label
			})
		 .tickPadding(3)
		 .tickSize(-width);

	  //*******************************************************
	  //*******************************************************	
	  var tip = d3.tip()				//defining text format when you mouse over on points
		  .attr("class", "d3-tip")
		  .offset([-10, 0])
		  .html(function(d) {
			  if (d.type =="seer")  // it is seer data
							return "GDP: 82%<br>Name: "+d.name+"<br>click for details";
			  else
			  {
				return "<b><p style='text-align:left;background-color:#aaa;font-family:courier;color:powderblue;'>Diseases: </br>Procedure: </p>";  
			  }			  	
		  });
		
      //*******************************************************
	  
	  var zoomBeh = d3.behavior.zoom()
		  .x(x)
	      //.y(y)		// stooping zooming on Y axis
		  .scaleExtent([0, 500])
		  .on("zoom", zoom);			// calling zoom method
	  //*******************************************************
	 

	  var svg = d3.select("#scatter")
		.append("svg")
		  .attr("width", outerWidth)
		  .attr("height", outerHeight)
		.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  //.call(zoomBeh) // setting zoom structure
		  ;  

	  svg.call(tip);

	  svg.append("rect")
		  .attr("width", width)
		  .attr("height", height);

	  svg.append("g")
		  .classed("x axis", true)
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)		// setting the xAxis variable
			
		// Rotate the xAxis words
		//.selectAll("text")
     	//	.style("text-anchor", "end")
        //  .attr("transform", function(  ) { return "rotate(-65)" })
			
		.append("text")                        // append means adding text (here adding xAxis title (i.e. Time-line)
		  .classed("label", true)
		  //.attr("transform", "rotate(-90)")
		  .attr("x", width)
		  .attr("y", margin.bottom )
		  .style("text-anchor", "end")		// or you can use it in "end"
		  .text("Time-line");					// setting title at the corner of graph axis
		  
	// Error: If you zoom the x -axis, then we loss the xAxis rotate view
	//        So, I commented zoomBeh function
	
		  
	  svg.append("g")
		  .classed("y axis", true)
		  .call(yAxis)
		  .style("font-size", "60%")		   // setting the size of Y axis text
		
		.selectAll("text")
		   .data( yAxisText )                 // Here, data is yAxisText.
		  .style('fill', function(d, i){  return textcolors[ i ]; })   // set color for each Yaxis ticker
		.append("text")
		  .classed("label", true)
		  .attr("transform", "rotate(-90)")
		  .attr("y", -margin.left)
		  .attr("dy", ".71em")
		  .style("text-anchor", "middle")
		  .text("USA states")               // setting title of Yaxis
		  ;
		  //since I selectAll("text") to set color, Yaxis title didn't show 
		  
	// ****** finally, declaring svg object	 
	var objects = svg.append("svg")
		  .classed("objects", true)
		  .attr("width", width)
		  .attr("height", height);
    // ****** adding horizontal line on svg
	objects.append("svg:line")
		  .classed("axisLine hAxisLine", true)
		  .attr("x1", 0)
		  .attr("y1", 0)
		  .attr("x2", width)
		  .attr("y2", 0);
	// ****** adding horizontal line on svg	  
	objects.append("svg:line")
		  .classed("axisLine vAxisLine", true)
		  .attr("x1", 0)
		  .attr("y1", 0)
		  .attr("x2", 0)
		  .attr("y2", height);
	
	var node = objects.selectAll(".dot")
		  .data(data)		// loading data
		.enter().append("circle")
			  .classed("dot", true)
			  .attr("r", function (d) { return 6 * Math.sqrt(d.weight / Math.PI); })
			  .attr("transform", transform)

			  .style("fill", function(d) { if( d.color==0) return "red";
											else return "green"; })	
			  // .style("fill", function(d){ return colorsWithShape[d.type];})	  
			  .on("click", function(d) {  alert("hi");	   })
			  .on("mouseover", tip.show)
			  .on("mouseout", tip.hide);
	
	// ****************************************************************************************
	// ****************************************************************************************  
	// setting the legend 
	var legend = svg.selectAll(".legend")
		  .data( legend_text )  		// load text to display in legend
		.enter().append("g")
		  .classed("legend", true)
		  .attr("transform", function(d, i) { return "translate(820," + (10+i * 20 )+ ")"; });	
		  // set the point position to display
		  // Here, i is the index of data array (legend_text)
	 
	legend.append("path")
		  .classed("dot", true)
		    .attr("fill", function(d, i) {  return legend_shapeColor[i]; })
            //.attr("stroke", "green")	// border color
		  .attr("d", d3.svg.symbol().type(function(d, i) {  return legend_shape[i]; }))
		  .attr("d", d3.svg.symbol().size( function(d, i) { return  legend_shapeSize[i]; } )   ) 
		  .attr("transform", transform);	// it is using default transform function that mentioned on above
		 		
	legend.append("text")
	    .attr("x", 30)
		.attr("dy", ".45em")		  
		.text(function(d) {  return d; });
	// ****************************************************************************************
	
	// ****************************************************************************************	
	// tooltip on x Axis
	d3.selectAll('.x.axis>.tick')
		.append('title')
		.text(function(d){
			//console.log( d );   // debugging 
		    return "ID: "+xAxisInst[d] +"\n"+xAxisText[d]+"\nclick for details";  
		});
		//.html   doesn't work
		  
	// ****************************************************************************************
	// click on the x axis tick		https://bl.ocks.org/sjengle/d079aefb45c22914760f2d6846985db8
	d3.selectAll(".x.axis>.tick text").on("click", function(d){
		//document.getElementById('details_pic').innerHTML = "set new data into other div";
		return alert(d);  		
		});
	// ****************************************************************************************		
	function zoom() {
		svg.select(".x.axis").call(xAxis);
		//svg.select(".y.axis").call(yAxis);

		svg.selectAll(".dot")
			.attr("transform", transform);
	}
    // ****************************************************************************************
    function transform(d) {
		return "translate(" + x( d.day ) + "," + y( d.y_data) + ")";
	}
	

});  // end of loading data from filename
