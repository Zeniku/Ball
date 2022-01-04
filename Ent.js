class Ent {
  constructor(config) {
    this.data = {} //for some not messy storage
    this.type = config.type
    this.position = new Vec(config.x, config.y)
    this.velocity = new Vec(config.velX, config.velY)
    this.init()
  }
  init() {
    this.type.init(this)
  }
  update() {
    this.velocity.scl(0.997, 0.997) //friction i guess
    this.position.addv(this.velocity)
    this.type.update(this)
  }
  accel(x, y) {
    this.velocity.add(x, y)
  }
  render(con) {
    this.type.render(this, con);
  }
  setPos(x, y) {
    this.position.setPos(x, y)
    return this
  }
  setVel(x, y) {
    this.velocity.setPos(x, y)
    return this
  }
}