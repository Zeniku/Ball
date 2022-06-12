window.onload = function() {
  let canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight;
    
    let asdf = new Head({
      radius: 20,
      segmentType: new Ball({
        radius: 20
      }),
      segmentOffset: 15,
      bodyCount: 50
    });
    
    asdf.create({
      x: width/2,
      y: height/2
    })
    asdf.create({
      x: width/2,
      y: height/2
    })
  requestAnimationFrame(update);
  function update(time) {
    Time.time = time;
    if(!Time.lastTimestamp) Time.lastTimestamp = time
    let elapsed = time - Time.lastTimestamp;
    Time.delta = elapsed / Time.fps

    if(elapsed > Time.fps){
      ctx.clearRect(0, 0, width, height);
      
      let filtered = entities.filter(e => e != null && !e.removed)
      if(filtered.length != entities.length){
        entities = filtered
        //check if entites are removed and remove it
      }
      timers.forEach(t => {
        t.update()
      })
      entities.forEach((e) => {  
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
  	    if(e.type instanceof Head){
  	      e.velocity.setLength(10)
  	    }
    	  e.update()
    	  //outline
    	  ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, e.type.radius * 1.4, 0, Math.PI * 2);
        ctx.fill()
    	});
    	for(let i = entities.length - 1; i >= 0; i--){
        entities[i].render(ctx)
    	}
      Time.lastTimestamp = time
    }
  	requestAnimationFrame(update);
  }
}
