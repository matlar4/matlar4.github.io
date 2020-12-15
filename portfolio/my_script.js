(function() {

  /*** This file is where you actually write your d3 code. Most of this stuff is standard setup that
  nobody (myself included) remembers how to do, so it's helpful to have it ready to go. Feel free to
  delete these comments once you understand what's going on ***/

  // These variables define the size of the SVG and how large the margins around the edges should be
  var margin = { top: 50, left: 50, right: 50, bottom: 50},
  height = 400 - margin.top - margin.bottom,
  width = 1600 - margin.left - margin.right;

  // This somewhat cryptic block grabs the "chart" div from the html file,
  // adds an SVG with attributes height and width, then adds a "g" element (basically the SVG-equivalent of a div) 
  // inside the SVG and translates it by the margins, so that when you append elements
  // to the SVG, the origin is shifted from (0,0) to (margin.left, margin.top)
  // Load the index file to see that the center of the red circle is 50 pixels in from the edges
  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale;
  var yScale;


  // Usually, you'll have a CSV or JSON file with your data
  // d3.queue() loads the data using d3.csv or d3.json, and then calls
  // the "ready" function once the data is loaded.
  d3.queue()
    .defer(d3.csv, "biggertextData.csv", function(d) {return d})
    .await(ready)
  
  // The anonymous function after "test.csv" gets each datapoint passed to it. The d3.csv method
  // treats everything as string, so line "d.age = +d.age;" turn the age variable into a number, then returns
  // the d object, so that in the ready function, you don't have to worry about the data being strings


  function createButtons(datapoints, dataTypeOptions){
    d3.select("#selectButton").on('change',function(){onUpdate(datapoints)}) //Skapar knapp 1
      .selectAll('myOptions')
      .data(dataTypeOptions)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; })

    var yearOptions = ["1989-1993","1994-1999","1999-2004","2005-2007","2010-2014"] //alternativ för waves filter knapp
    d3.select("#waveButton").on('change',function(){onUpdate(datapoints)})//Skapar knapp 2
      .selectAll('myOptions')
      .data(yearOptions)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; })


  }
  function onUpdate(datapoints){
    var e = document.getElementById("selectButton");
    var wantedType = e.options[e.selectedIndex].value;
    var f = document.getElementById("waveButton");
    var wantedWave = f.options[f.selectedIndex].value;

    var data = filterData(datapoints, wantedWave, wantedType);
    updateData(data)

  }


  function getFilters(){
    var waveOption = document.getElementById("waveButton");
    var wantedWave = waveOption.options[waveOption.selectedIndex].value;

    var typeOption = document.getElementById("selectButton");
    var wantedType = typeOption.options[typeOption.selectedIndex].value;


    return [wantedWave, wantedType]
  }

  function filterData(datapoints, wantedWave, wantedType){
    var filteredYearData = datapoints.filter(function(d){return d.wave === wantedWave});
    filteredDict = {}; //dictionary key = country value = value
    filteredList = []; //list only values
    filteredListOfObjects = []; //list of objects
    filteredYearData.forEach(function(item, index){
      filteredDict[item.country] = parseFloat(item[wantedType]); //fill dictionary    SKA JAG PARSA FLOAT?
      filteredList.push(parseFloat(item[wantedType])) //fill list

      var point = {country:item.country, value:item[wantedType]}; //fill list of objects
      filteredListOfObjects.push(point)
    });
    //return filteredDict
    //return filteredList
    return filteredListOfObjects
  }

  function updateData(filteredData){ // TODO FIXA DETTA AAAAH
    console.log(filteredData)

    yScale = d3.scaleLinear()
        .domain([0,1])
        .range([height,0]);

    // update the bars
    svg.selectAll("rect")
        .data(filteredData)
        .transition().duration(1000)
        .attr('x', (s) => xScale(s.country))
        .attr('y', (s) => yScale(s.value))
        .style("opacity", 0.5)
        .attr('height', (s) => height - yScale(s.value))

    /*
    yScale = d3.scaleLinear()
        .domain([0,d3.max(filteredData, d=>d.value)])
        .range([height,0]);
    var svg = d3.selectAll("chart").transition();

    svg.selectAll('rect')
        .duration(500)
        .attr("d", valueline(filteredData));
    svg.selectAll(".y.axis")
        .duration(500)
        .call(d3.axisLeft(yScale));

     */


  }

  function createData(filteredData){

    yScale = d3.scaleLinear()
      .domain([0,1])
      .range([height,0]);

    xScale = d3.scaleBand()
      .domain(filteredData.map((s)=>s.country))
      .range([0, width])
      .padding(0.2);

    svg.append('g')
        .call(d3.axisLeft(yScale));
    svg.append('g')
        .attr('transform',`translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.selectAll("rect")
        .data(filteredData)
        .enter()
        .append('rect')
        .attr('x', (s) => xScale(s.country))
        .attr('y', (s) => yScale(s.value))
        .style("opacity", 0.5)
        .attr('height', (s) => height - yScale(s.value))
        .attr('width', xScale.bandwidth())
  }

  function createHappinessBars(filteredData){

    var newYscale = d3.scaleLinear()
        .domain([0,1])
        .range([height,0]);

    console.log("1")

    var newXscale = d3.scaleBand()
        .domain(filteredData.map((s)=>s.newcont))
        .range([0, width])
        .padding(0.2);

    console.log("2")

    svg.append('g')
        .call(d3.axisLeft(newYscale));
    svg.append('g')
        .attr('transform',`translate(0,${height})`)
        .call(d3.axisBottom(newXscale));
    console.log("3")

    svg.selectAll("rect")
        .data(filteredData)
        .enter()
        .append('rect')
        .attr('x', (s) => newXscale(s.newcont))
        .attr('y', (s) => newYscale(s.newhap))
        .style("fill", "#FF0000")
        .attr('height', (s) => height - newYscale(s.newhap))
        .attr('width', newXscale.bandwidth());
    console.log("4")
  }

  function createHappinessAverage(datapoints){
    console.log("INUTI NYA")
    console.log(datapoints)
    var happinessList = []
    datapoints.forEach(function(item, index){


      var point = {cont:item.country, hap:parseFloat(item.Happiness)}; //fill list of objects
      happinessList.push(point)
    });

    console.log(happinessList)
    avgHappyList=[]

    for(i=0;i<happinessList.length;i+=5){
      var newAvg = 0;
      for (j=0;j<5;j++){
        newAvg+=(happinessList[i+j].hap)

      }
      //console.log(newAvg)
      newAvg = newAvg/5;
      var newpoint = {newcont:happinessList[i].cont, newhap:newAvg.toString()}; //fill list of objects
      avgHappyList.push(newpoint)
    }

    //console.log(avgHappyList)

    return avgHappyList



  }

  function changeStuff(){
    console.log("JSADJASD")
  }



  function ready(error, datapoints) {
    if (error) throw error;

    //SKRIV KOD FRÅN HÄR

    createButtons(datapoints, datapoints.columns.slice(2,10)); //Skapar knappar

    //createAxes(datapoints) //Skapa Axlar

    var filters = getFilters();

    var filteredData = filterData(datapoints, filters[0], filters[1]); //Apply wanted filters to big dataset, return array with country and wanted type from wanted wave
    //console.log(filteredData);
    //console.log(datapoints);

    var avgHappy = createHappinessAverage(datapoints);
    console.log(avgHappy);
    //createHappinessBars(avgHappy);

    createData(filteredData)

    //create THING data
    //update THING data?






























    //console.log(datapoints);
/*
    var filteredYearData = datapoints.filter(function(d) {return d.wave === "1989-1993"});
    console.log(filteredYearData)
    var filteredTypeData = filteredYearData.filter(function(d){return d === "PerHea"})
    console.log(filteredTypeData)
    var wantedThing = "PerHea";

    var stuff = {};
    stuff["PerHea"] = 1;

    var newList = {};


    console.log(filteredYearData[3].country)



    filteredYearData.forEach(function(item, index){
      //console.log(item,index)
      //console.log(item.country)
      //console.log(item[wantedThing])
      newList[item.country] = item[wantedThing];

    });

    console.log(newList)
*/

    //svg.selectAll(".bar")
    //    .data(filteredData)



    //TILL HÄR

  }
})();