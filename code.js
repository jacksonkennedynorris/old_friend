data_prom = d3.csv("map_2020.csv")
map_prom = d3.json("usaJSON.json")

Promise.all([data_prom,map_prom]).then(function(data){

    var state_d = data[0]
    var map_d = data[1].features
    
    var data = state_d
    draw_map(data,map_d)
})

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
