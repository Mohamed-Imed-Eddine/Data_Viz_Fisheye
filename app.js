var width = 1000;
var height = 500;

var color = d3.scale.category20();

var svg = d3.select("#graph")
      .append('svg')
      .attr('width', width )
      .attr('height', height)
      .style('background-color',"#e9efef");


let x;

var fisheye = d3.fisheye.circular()
.radius(200)
.distortion(2);



d3.json("data.json", function( data) {
x=data;


  // Créer les arets
  var link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr('x1',function(d) { d.x1=line_position(d)[0]; return d.x1; })
    .attr('y1',function(d) { d.y1=line_position(d)[1]; return d.y1 })
    .attr('x2',function(d) { d.x2=line_position(d)[2]; return d.x2; })
    .attr('y2',function(d) { d.y2=line_position(d)[3]; return d.y2; })
    .attr("stroke-width",function(d) { return stroke(d); })
    .attr("stroke","#565656");



  // Créer les sommets
  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter();

    node.append("circle")
    .datum( function(d) {
      return {x: get_cx(d), y: get_cy(d), id:get_id(d)}
  })
      .attr("r",function(d){d.z=1; return 19;})
      .attr("cx",function(d) { return d.x })
      .attr("cy",function(d) { return d.y })
      .style("fill", function(d){ return color(get_id(d));});

    //Ajouter du text
      node.append("text")
      .attr("x",function(d) { d.x = get_cx(d); return d.x })
      .attr("y",function(d) { d.y = get_cy(d); return d.y })
      .attr("font-family","Verdana")
      .attr("font-size",15)
      .attr('fill','black')
      .text(function(d) { return d.pays; })
      .attr("text-anchor","middle");
      
});




svg.on("mousemove", function() {
  fisheye.focus(d3.mouse(this));

  var svg_nodes=svg.selectAll("circle");
  //console.log("node");
  //console.log(svg_nodes);
  svg_nodes.each(function(d) { d.fisheye = fisheye(d);
  })
      .attr("cx", function(d) { return d.fisheye.x; })
      .attr("cy", function(d) { return d.fisheye.y; })
      .attr("r", function(d) { return d.fisheye.z * 15; });

///////////////////////////////////////////////////
  
      var svg_links=svg.selectAll("line");

         svg_links.each(function(d){
        var dep=new Create_Obj(d.x1,d.y1);
        var des=new Create_Obj(d.x2,d.y2);
        d.dep=fisheye(dep);
        d.des=fisheye(des);
    })
    .attr("x1", function(d) { return d.dep.x })
        .attr("y1", function(d) { return d.dep.y; })
        .attr('x2',function(d) { return d.des.x; } )
        .attr('y2',function(d) { return d.des.y; } )
        .attr('stroke-width',function(d){ return d.value;  } );


////////////////////////////////////////////////////////

      var text=svg.selectAll("text");
      //console.log(text);
      text.each(function(d){
          text=new Create_Obj(d.cx*width,d.cy*height);
          return d.fisheye = fisheye(text);

      })
      .attr("x",function(d) { return d.fisheye.x; } )
      .attr('y',function(d) { return d.fisheye.y; } )
      .text(function(d){
          return d.pays;
      })
      .attr("font-family", "sans-serif")
.attr("font-size", "10px")
.attr("text-anchor", "middle")
.attr("fill", "black");
});


////////////////////////////////////////////////////////////

function get_cx(d){
  return Math.floor(d.cx*width);
}
function get_cy(d){
  return Math.floor(d.cy*height);
}
function get_id(d){
  return d.id;
}
function line_position(d){
  var i_s = d.source
  var i_t = d.target
  var n_s = x.nodes[i_s-1];
  var n_t = x.nodes[i_t-1];
  var x1,x2,y1,y2
  x1 = get_cx(n_s);
  y1 = get_cy(n_s);
  x2 = get_cx(n_t);
  y2 = get_cy(n_t);

  return [x1,y1,x2,y2] ; }

function stroke(d){
  return d.value+"px";
}

function Create_Obj(x,y) {
  this.x=x;
  this.y=y;   
}

