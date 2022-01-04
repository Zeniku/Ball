class Head extends Ball {
    constructor(config) {
      super(config)
      this.bodyCount = config.bodyCount
      this.segmentOffset = config.segmentOffset
      this.segmentType = config.segmentType
      this.color = "#D54949"
    }
    init(ent) {
      super.init(ent)
      ent.data.timer = 0
      ent.data.segments = []
      this.createSegments(ent)
    }
    createSegments(ent) {
      for (let i = 0; i < this.bodyCount; i++) {
        this.addSegment(ent, this.segmentType)
        /*
        let seg = ent.data.segments
        seg[i] = this.segmentType.create({})
        seg[i].position.setPosv(ent.position).add(this.segmentOffset * i, this.segmentOffset * i)
        */
      }
    }
    segmentMove(ent) {
      //a bit jittery
      let { data } = ent
      let seg = data.segments
      // loop through each position
      for (let i = 0; i < seg.length; i++) {
        // get last and current position
        const last = seg[i - 1] ? seg[i - 1].position : ent.position
        const curr = seg[i].position;
  
        // get difference in x and y of each position
        const dx = curr.x - last.x;
        const dy = curr.y - last.y;
  
        // calculate the angle between the two parts of the snake
        let angle = Math.atan2(dy, dx);
  
        // get the new x and new y using polar coordinates
        const nx = this.segmentOffset * Math.cos(angle);
        const ny = this.segmentOffset * Math.sin(angle);
        // add the new x and new y to the last snake's position to "join" the two together without a gap
        curr.setPos(nx + last.x, ny + last.y);
      }
    };
    addSegment(ent, segmentType){
      let seg = ent.data.segments
      let lseg = seg[seg.length - 1] ? seg[seg.length - 1] : ent
      let nseg = segmentType.create({})
      nseg.color = ((Math.random() * 10) > 5)? "#D54949" : "#4990D5"
      nseg.position.setPosv(lseg.position)
      seg.push(nseg)
    }
    removeSegment(ent, id){
      let seg = ent.data.segments
      for(let h of seg){
        if(h.id = id){
          if(entities[id] == h){
            entities.splice(id, 1)
            seg.splice(seg.indexOf(h), 1)
          }
        }
      }
    }
    update(ent) {
      this.segmentMove(ent)
      super.update(ent)
      ent.data.timer++
    }
    create(config) {
      entities.push(new Ent(Object.assign({
        type: this
      }, config)))
      entities[entities.length - 1].id = entities.length - 1
      return entities[entities.length - 1]
    }
  }