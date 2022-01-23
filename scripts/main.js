window.onload = function() {
  let canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;
		
  console.log('Hello World!');
    
    let asdf = new Head({
      radius: 20,
      segmentType: new Ball({
        radius: 20
      }),
      segmentOffset: 15,
      bodyCount: 200,
    })
    asdf.create({}).setPos(width/2, height/2)
    
  let hh = true
  function init(){
    if(hh){
      entities.forEach(e => {
  	    if(e.type instanceof Head) e.velocity.setAngle(Math.random() * 360)
      });
      hh = false
    }
  }
  let hhh = true
  update();
  function update() {
    context.clearRect(0, 0, width, height);
  	for(let i = 0; i < entities.length; i++){
  	  let e = entities[i],
  	    pos = e.position,
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
	    if(e.type instanceof Head){
	      e.velocity.setLength(10)
	    }
  	  e.update()
  	  //outline
  	  context.fillStyle = "#000000"
      context.beginPath()
      context.arc(e.position.x, e.position.y, e.type.radius * 1.4, 0, Math.PI * 2);
      context.fill()
  	};
  	for(let i = entities.length - 1; i >= 0; i--){
      entities[i].render(context)
  	}
  	init();
  	requestAnimationFrame(update);
  }
}