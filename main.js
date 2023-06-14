// @ts-nocheck
class Firefly {
  #x
  #y
  #size
  #speedX
  #speedY

  constructor({ x, y, size, speedX, speedY }) {
    this.#x = x
    this.#y = y
    this.#size = size
    this.#speedX = speedX
    this.#speedY = speedY
  }

  #validateLimits() {
    if(this.#x < 0 || this.#x > window.innerWidth) {
      this.#speedX *= -1
    }
    if(this.#y < 0 || this.#y > window.innerHeight) {
      this.#speedY *= -1
    }
  }

  updatePosition() {
    this.#x += this.#speedX
    this.#y += this.#speedY
    this.#validateLimits()
  }

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  get size() {
    return this.#size
  }

  get speedX() {
    return this.#speedX
  }

  get speedY() {
    return this.#speedY
  }
}

class FireflyFactory {
  #MIN_SIZE = 1
  #MAX_SIZE = 2
  #SPEED = 0.5

  #generateSize() {
    return Math.random() * this.#MAX_SIZE + this.#MIN_SIZE
  }

  #generateSpeed() {
    return this.#SPEED * (Math.random() - this.#SPEED)
  }

  create() {
    return new Firefly({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: this.#generateSize(),
      speedX: this.#generateSpeed(),
      speedY: this.#generateSpeed()
    })
  }
}

class FireflyCanvas {
  #FIREFLY_COUNT = 100
  #FIREFLY_COLOR = '#ffff00'
  #START_ARC_ANGLE = 0
  #END_ARC_ANGLE = 2 * Math.PI

  #canvas
  #context
  #fireflyFactory
  #fireflies = []

  constructor({ canvas, context, fireflyFactory }) {
    this.#canvas = canvas
    this.#context = context
    this.#fireflyFactory = fireflyFactory
    this.#initialize()
  }

  #resize() {
    this.#canvas.width = window.innerWidth
    this.#canvas.height = window.innerHeight
  }

  #draw({ x, y, size }) {
    this.#context.beginPath()
    this.#context.arc(x, y, size, this.#START_ARC_ANGLE, this.#END_ARC_ANGLE)
    this.#context.fillStyle = this.#FIREFLY_COLOR
    this.#context.fill()
    this.#context.closePath()
  }

  #animate() {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    this.#fireflies.forEach(firefly => {
      firefly.updatePosition()
      this.#draw(firefly)
    })
    requestAnimationFrame(() => this.#animate())
  }

  #generateFireflies() {
    for(let i = 0; i < this.#FIREFLY_COUNT; i++) {
      const firefly = this.#fireflyFactory.create()
      this.#fireflies.push(firefly)
    }
  }

  #initialize() {
    this.#canvas.width = window.innerWidth
    this.#canvas.height = window.innerHeight
    window.addEventListener('resize', this.#resize)
    this.#generateFireflies()
    this.#animate()
  }

  addFirefly() {
    const firefly = this.#fireflyFactory.create()
    this.#fireflies.push(firefly)
  }
}

const canvas = document.getElementById('fireflies')
const context = canvas.getContext('2d')

const fireflyFactory = new FireflyFactory()
const fireflyCanvas = new FireflyCanvas({ canvas, context, fireflyFactory })

canvas.addEventListener('click', () => {
  fireflyCanvas.addFirefly()
})