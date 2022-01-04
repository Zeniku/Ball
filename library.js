/**
 * by pankiwi © 2021
 * you can use, edit, here but not remove this
 * thanks contributors
 **/

/*
 * Registers a unit's class for I/O stuff (saves and net)
 * Requires unit.constructor.get() to have classId: () => unit.classId
 */
let registerClass = unit => {
  // Register unit's name
  EntityMapping.nameMap.put(unit.name, unit.constructor);

  // Find available class id and register it
  unit.classId = -1;
  for (var i in EntityMapping.idMap) {
    if (!EntityMapping.idMap[i]) {
      EntityMapping.idMap[i] = unit.constructor;
      unit.classId = i;
      return;
    }
  }

  // Incase you used up all 256 class ids; use the same code for ~250 units you idiot.
  throw new IllegalArgumentException(unit.name + " has no class ID");
};

module.exports = {
  /*
   *unit can't move only atack
   */
  nullAI: () => extend(AIController, {
    updateMovement() {
      //todo
    }
  }),
  segemntAI: () => extend(AIController, {
    updateMovement() {
     this.unloadPayloads();
     
     if (this.unit.getSegment() != null && !this.unit.getSegment().dead) {
     
       let next = this.unit.getSegment();
     
       let dst = this.unit.getDstSegment();
     
       Tmp.v1.trns(Angles.angle(this.unit.x, this.unit.y, next.x, next.y), -this.unit.getOffset());
     
     
       if (dst > this.unit.getOffset()) {
     
         Tmp.v2.trns(
           Angles.angle(this.unit.x, this.unit.y, next.x + Tmp.v1.x, next.y + Tmp.v1.y),
           this.unit.speed()
         );
         this.unit.moveAt(Tmp.v2);//makesesees
       }
     }
    }
  }),
  /*
   * sement for sneak
   */
  segment(name, type, constructor) {
    //check is null constructor
    if (type == undefined) type = {};
    if (constructor == undefined) constructor = {};

    //set code default
    type = Object.assign({
      flying: true,
      offsetSegment: 10,
      engines: 0,
      engineSize: 0,
      engineRotOffset: 0,
      drawEngine(unit) {
        if (!unit.isFlying()) return;

        var scl = unit.elevation;
        var offset = unit.type.engineOffset / 2 + unit.type.engineOffset / 2 * scl;

        Draw.color(unit.team.color);
        for (let i = 0; i < this.engines; i++) {
          Fill.circle(
            unit.x + Angles.trnsx(unit.rotation + this.engineRotOffset + (i * 360 / this.engines), offset),
            unit.y + Angles.trnsy(unit.rotation + this.engineRotOffset + (i * 360 / this.engines), offset),
            (unit.type.engineSize + Mathf.absin(Time.time, 2, unit.type.engineSize / 4)) * scl
          );
        }
        Draw.color(Color.white);
        for (let i = 0; i < this.engines; i++) {
          Fill.circle(
            unit.x + Angles.trnsx(unit.rotation + this.engineRotOffset + (i * 360 / this.engines), offset - 1),
            unit.y + Angles.trnsy(unit.rotation + this.engineRotOffset + (i * 360 / this.engines), offset - 1),
            (unit.type.engineSize + Mathf.absin(Time.time, 2, unit.type.engineSize / 4)) / 2 * scl
          );
        }
        Draw.color();
      }
    }, type);


    let unit = extend(UnitType, name, type);

    //code segment
    unit.constructor = () => extend(UnitEntity, Object.assign({
      _offset: 0,
      _parent: null,
      _segment: null,
      add() {
        //check parent is null
        if (this.getParent() != null) this.super$add();
      },
      setType(type){
        this._offset = unit.offsetSegment;
        Log.info(unit.offsetSegment+ "_");
        this.super$setType(type);
      },
      update() {
        this.super$update();

        this._update();
      },
      _update() {
        let parent = this.getParent();
        
        if(parent != null && parent.dead) this.kill();

        if (parent != null && this.team != parent.team) this.team = parent.team;
        
        

        //if (parent != null || !parent.dead) this.updateMove();
      },
      updateMove() {
        if (this.getSegment() != null && !this.getSegment().dead) {

          let next = this.getSegment();

          let dst = this.getDstSegment();

          Tmp.v2.trns(Angles.angle(this.x, this.y, next.x, next.y), -unit.offsetSegment);


          if (dst > unit.offsetSegment) {

            Tmp.v3.trns(
              Angles.angle(this.x, this.y, next.x + Tmp.v2.x, next.y + Tmp.v2.y),
              this.speed()
            );
            this.moveAt(Tmp.v3);
          }
        }
      },
      /*
      return dinstace of next segment
      */
      getDstSegment() {
        let next = this.getSegment();

        if (next == null || next.dead) return -100;

        Tmp.v1.trns(Angles.angle(this.x, this.y, next.x, next.y), -unit.offsetSegment);

        return Mathf.dst(this.x, this.y, next.x + Tmp.v1.x, next.y + Tmp.v1.y) - (this.hitSize + 10);
      },
      isAI() {
        return false; //you can't control go brrrrrrr
      },
      /*
       * as the next segment moves further away, it will have higher speed
       */
      speed() {
        return this.getParent().speed() + (((this.getDstSegment()) / (unit.offsetSegment + this.hitSize)) * 0.1);
      },
      //fuck you pallarax
      impulseNet(vec) {},
      //can head create infinity segments
      cap() {
        return this.count() + 1;
      },
      getOffset(){
        return this._offset;
      },
      setParent(pr) {
        this._parent = pr;
      },
      getParent() {
        return this._parent;
      },
      setSegment(seg) {
        this._segment = seg;
      },
      getSegment() {
        return this._segment;
      },
      write(write) {
        this.super$write(write);
        
        this._write(write);
      },
      //write for segment
      _write(w) {
        //write id
        w.i(this.id);
        //write id segment and parent
        w.i(this._segment != null ? this._segment.id : -1);
        
        w.i(this._parent != null ? this._parent.id : -1);
      },
      read(read) {
        this.super$read(read);
        
        this._read(r);
      },
      //read segment
      _read(r) {
        //read id
        this.id = read.i();
        
        //read id and get unit from Groups by id
        this.setSegment(Groups.unit.getByID(read.i()));
        
        this.setParent(Groups.unit.getByID(read.i()));
        
        //call head for add child
        this.getParent().addChild(this.self);
      },
      //read for segment
      classId: () => unit.classId
    }, constructor));

    registerClass(unit);

    return unit;
  },
  head(name, type, constructor) {
    if (type == undefined) type = {};
    if (constructor == undefined) constructor = {};

    type = Object.assign({
      lengthSnake: 1,
      //offset separation
      offsetSegment: 0,
      //body
      body: null,
      end: null,
      flying: true
    }, type);


    let unit = extend(UnitType, name, type);

    unit.constructor = () => extend(UnitEntity, Object.assign({
      _segments: [],
      totalSegments: 0,
      setSneak: false,
      add() {
        //create segments
        this.super$add();
        
        //check is on snake

        if (!this.setSneak) this.createSegments();
      },
      update() {
        this.super$update();
        //update
        this._update();
      },
      _update() {
        //if has changes array segments
        if (this._segments.filter(unitSegment => unitSegment != null && !unitSegment.dead).length != this.totalSegments) {
          //update
          this._segments = this._segments.filter(unitSegment => unitSegment != null && !unitSegment.dead);
          this.totalSegments = this._segments.length;

          //update segments

          for (let i = 0; i < this._segments.length; i++) {
            let lastUnit = this._segments[i - 1] ? this._segments[i - 1] : this.self;
            let nowUnit = this._segments[i];

            if (nowUnit != null && !nowUnit.dead) now.setSegment(lastUnit);
          }
        }
        //ohno
        if (this.canDead(this.totalSegments)) this.kill();
      },
      canDead(amount) {
        return amount < 1
      },
      createSegments() {
        //set on snake
        this.setSneak = true;
        //:b anti error
        if (unit.body != null || unit.end != null) {
          //create childs
          for (let i = 0; i < unit.lengthSnake; i++) {
            //last unit
            let lastUnit = this._segments[i - 1] ? this._segments[i - 1] : this.self;

            //unit
            let segment = i + 1 == unit.lengthSnake ? unit.end.create(this.team) : unit.body.create(this.team);
            
            Tmp.v1.trns(this.rotation, segment.hitSize);
            Tmp.v1.add(lastUnit.x, lastUnit.y);
            
            //set unit
            segment.setParent(this.self);
            
            //set x,y

            segment.set(Tmp.v1.x, Tmp.v1.y);
            
            //rotation

            segment.rotation = Math.atan2(lastUnit.y - segment.y, lastUnit.x - segment.x) * 180 / Math.PI;;

            segment.setSegment(lastUnit);

            //multiplayer compatibility

            Events.fire(new UnitCreateEvent(segment, null, this.self));
            if (!Vars.net.client()) {
              segment.add();
            }
            // register segment
            this.addChild(segment);
          }

        } else Log.err("constructor some snake body is null");
      },
      addChild(child_) {
        //add child
        this._segments.push(child_);
        //updateList
        this.totalSegments = this._segments.length;
      },
      write(write) {
        this.super$write(write);
        //write id
        write.i(this.id);
        //write snake its on
        write.bool(this.setSneak);
      },
      read(read) {
        this.super$read(read);
        //read id
        this.id = read.i();
        //read snake its on
        this.setSneak = read.bool();
      },
      classId: () => unit.classId
    }, constructor));

    registerClass(unit);

    return unit;
  }
};