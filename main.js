function im(...script){
  for(let i of script){
    let string = String(i).trim();
    if(i != undefined && string.endsWith(".js")){
      document.write('<script type="text/javascript" src=' + string + '></script>');
    }
  }
}
im("Vec.js", "Ent.js", "Ball.js", "Head.js")
window.onload = function() {
  let canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;
		
  console.log('Hello World!');
    
    types.hh = new Head({
      radius: 10,
      segmentType: new Ball({
        radius: 10
      }),
      segmentOffset: 10,
      bodyCount: 100,
    })
    
    for(let i in types){
      types[i].create({}).setVel(10, 10)
    }
    
  let ht = 0
  update();

  function update() {
    context.clearRect(0, 0, width, height);
  	entities.forEach(e => {
  	  let pos = e.position,
  	    vel = e.velocity
  	  if (pos.x > width) {
	      pos.x = width;
	      vel.scl(-bounce, 1);
	    }else if (pos.x < 0) {
	      pos.x = 0;
	      vel.scl(-bounce, 1);
	    }
	    if (pos.y > height) {
	      pos.y = height;
	      vel.scl(1, -bounce);
	    }else if (pos.y < 0) {
	      pos.y = 0;
	      vel.scl(1, -bounce);
	    }
  	  e.update()
  	  e.render(context)
  	  if(ht >= 60){
  	    //logs(e.id)
  	  }
  	});
  	if(ht >= 60){
  	  logs('ha')
  	  ht = 0
  	}
  	ht++//ht is a timer
  	requestAnimationFrame(update);
  }
}