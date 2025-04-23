class DigitBag{
	constructor(x,y){
		this.x = x
		this.y = y

		this.index = -1 // Will be defined in "GameManager" class

		this.width = 100
		this.height = 30

		this.animations = {doors:null}
		this.animations.doors = new DoorsAnimation(this)
		this.animations.progress = new ProgressAnimation(this)

		this.isActivated = false

		// Progress of fullfillness
		this.progress = 0
	}
	increaseProgress(step){
		if(this.progress>100){
			this.progress=100
			return
		}
		this.progress += step
	}
	draw(){
		ctx.strokeStyle = "white"
		ctx.lineWidth = 2
		ctx.strokeRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height)
	}
	animate(){
		this.animations.doors.animate()
		this.animations.progress.animate()
	}
	update(){
		this.animations.doors.isActivated = this.isActivated

		this.draw()
		this.animate()
	}
}
class ProgressAnimation{
	constructor(self){
		this.self = self

		this.progress = 0
	}
	drawProgress(){
		let x,y
		x = this.self.x
		y = this.self.y
		let w,h
		w = this.self.width
		h = this.self.height

		let gap = 10
		ctx.strokeStyle = "white"
		ctx.strokeRect(x-w/2, y-h/2+h+gap, w, h/2)

		let progress = this.progress/100

		ctx.fillStyle = "white"
		ctx.fillRect(x-w/2, y-h/2+h+gap, w*progress, h/2)
	}
	refillBar(){
		// Change progress with animation
		let step = 1

		if(this.self.progress > this.progress){
			this.progress += step
		}
	}
	animate(){
		this.drawProgress()
		this.refillBar()
	}
}
class DoorsAnimation{
	constructor(self){
		this.self = self

		this.doorwidth = 10

		this.x = 0
		this.y = 0 

		// Dots will work only on one side of box and, but in on another side will projected like mirror
		// Dots using ONLY in 'draw' function
		this.dots = {passive:
					 [{x:-this.self.width/2, y:0},
		 			 {x:-this.self.width/2, y:1},],
		 			 
		 			 active:[
		 			 {x:0, y:1},
		 			 {x:0, y:0},
		 			 ]
		 			}

		this.progess = {progress:0, max:40} 			
		this.isActivated = false	
	}
	draw(){
		let dw = this.doorwidth*this.progess.progress/this.progess.max
		let x,y
		x = this.self.x
		y = this.self.y-this.self.height/2-dw
		

		let firstdot = this.dots.passive[0]
		// Left Door
		ctx.beginPath()
		ctx.moveTo(x+firstdot.x, y+firstdot.y*dw)
		for(let dot in this.dots.passive){
			dot = this.dots.passive[dot]
			ctx.lineTo(x+dot.x, y+dot.y*dw)
		}
		for(let dot in this.dots.active){
			dot = this.dots.active[dot]
			ctx.lineTo(x+dot.x+this.x, y+dot.y*dw+this.y)
		}
		ctx.lineTo(x+firstdot.x, y+firstdot.y*dw)
		ctx.stroke()

		// Right Door
		ctx.beginPath()
		ctx.moveTo(x-firstdot.x, y+firstdot.y*dw)
		for(let dot in this.dots.passive){
			dot = this.dots.passive[dot]
			ctx.lineTo(x-dot.x, y+dot.y*dw)
		}
		for(let dot in this.dots.active){
			dot = this.dots.active[dot]
			ctx.lineTo(x-(dot.x+this.x), y+(dot.y*dw+this.y))
		}
		ctx.lineTo(x-firstdot.x, y+firstdot.y*dw)
		ctx.stroke()
	}
	movedoors(){
		// Move Doors after Activation
		let width = this.self.width/2
		let progess = this.progess.progress/this.progess.max // Converted to precents

		this.x = (Math.sin(Math.PI/2+Math.PI*3/4*progess)-1)*width 
		this.y = (Math.cos(Math.PI/2+Math.PI*3/4*progess))*width
	}
	activatedoors(){
		// Listener To Watch Activation Of Doors
		let progess = this.progess.progress
		if(this.isActivated){
		if(progess<this.progess.max){
			this.progess.progress++
		}
		}
		else{
		if(progess>0){
			this.progess.progress--
		}
		}
	}
	animate(){
		this.activatedoors()
		this.movedoors()
		this.draw()
	}
}