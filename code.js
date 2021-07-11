//data_prom = d3.csv("map_1984.csv")
map_prom = d3.json("usaJSON.json")

var my_string = "map_"
var csv_end = ".csv"
var year; 
var myarray = []; 
var button_list = [] 

latest_year = 2020

for (year = latest_year; year>=1976; year = year-4){

  var btn = document.createElement("BUTTON");   // Create a <button> element
  btn.setAttribute("id", "button" + year.toString())
  btn.setAttribute("year", year)
  if (year >= 2000){
    short = (year % 2000).toString()
    if (year < 2010){
      short = "0" + short
    }
  }
  else{
    short = (year%1900).toString()
  }
  btn.innerHTML = year.toString();                   // Insert text
  document.getElementById("button_div").appendChild(btn);               // Append <button> to <body>
  button_list.push(btn)
  var get_promise = d3.csv(my_string + String(year) + csv_end)
  var dict = {
    year : year,
    promise: get_promise
  }
  myarray.push(dict)
}
// Create buttons and once clicked send them to the promise
for (i = 0; i<button_list.length; i++){
    button_list[i].addEventListener ("click", function() {
      for (j = 0; j<myarray.length; j++)
      {
        if (myarray[j].year == this.innerHTML){
          push_to_function(myarray[j],false)
        }
      }
    });
  }
var end = myarray[0]
push_to_function(end,true)

// This function pushes to the use data function 
function push_to_function(year_dict,is_first_year) {
  if (!is_first_year){
      
      d3.select('totalTable').remove()
  }
  var data_prom = year_dict.promise
  var year = year_dict.year
  //promise.then(function(data){useData()})

  Promise.all([data_prom,map_prom]).then(function(data){
    var state_d = data[0]
    var map_d = data[1].features
    
    var data = state_d
    draw_map(data,map_d)
  })
}
/*
Promise.all([data_prom,map_prom]).then(function(data){

    var state_d = data[0]
    var map_d = data[1].features
    
    var data = state_d
    draw_map(data,map_d)
})
*/
var draw_map = function(data,geoP){

    console.log(data)

    var screen = {
        width : 1200,
        height : 575
      }
     
     var margins = {
       top:10,
       bottom:10,
       left:10,
       right:100
     };
     var height = screen.height - margins.top - margins.bottom;
     var width = screen.width - margins.left - margins.right;
     var svg = d3.select('.straightUp')
        .attr('height',height)
        .attr('width', width)

     var dems = data.filter(get_dems)
     var reps = data.filter(get_reps)

    var projection = d3.geoAlbersUsa()
  
    var states = svg.append('g')
        .attr('id','states')
        .selectAll('g')
        .data(geoP)
        .enter()
        .append('g')
        .attr('fill',function(d, data){
            var state = d.properties.name
            var dem = dems.find(get_state, state)
            var rep = reps.find(get_state, state)
            
            var dem_votes = parseInt(dem.candidatevotes)
            var rep_votes = parseInt(rep.candidatevotes)
            if (dem_votes > rep_votes){
                return "#065DB6"}
            else{
                return "#D74934"
            }
        })
        .attr('stroke',"#D1D0E3")

    var stateGenerator = d3.geoPath()
        .projection(projection)
    states.append('path')
        .attr('d',stateGenerator)
}

var get_dems = function(data){
    return data.party_detailed == "Democrat"
}

var get_reps = function(data){
    return data.party_detailed == "Republican"
}

var get_state = function(data) {
    return data.state == this
}
