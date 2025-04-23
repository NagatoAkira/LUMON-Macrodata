class DigitBag{
	constructor(x,y){
		this.x = x
		this.y = y

		this.index = -1 // Will be defined in "GameManager" class

		this.width = 90
		this.height = 25

		this.animations = {doors:null}
		this.animations.doors = new DoorsAnimation(this)
		this.animations.progress = new ProgressAnimation(this)

		this.isActivated = false

		// Progress of fullfillness
		this.progress = 0
	}
	increaseProgress(step){
		if(this.progress>=100){
			this.progress=100
			return
		}
		this.progress += step
	}
	draw(){
		ctx.strokeStyle = colors.light
		ctx.lineWidth = 2
		ctx.strokeRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height)
		ctx.fillStyle = colors.light
		ctx.fillText("0"+this.index.toString(), this.x-5, this.y+4)
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

		let gap = 5
		ctx.strokeStyle = colors.light
		ctx.strokeRect(x-w/2, y-h/2+h+gap, w, h/1.3)

		let progress = this.progress/100

		ctx.fillStyle = "#d6fffe"
		ctx.fillRect(x-w/2, y-h/2+h+gap, w*progress, h/1.3)
		ctx.fillStyle = "#84b8b6"
		ctx.font = "bold 12px sans-serif"
		ctx.fillText(this.progress.toString()+"%", x-w/2+7, y-h/2+h*1.5+gap+2)
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

		this.doorwidth = 12

		this.x = 0
		this.y = 0 

		// Dots will work only on one side of box and, but in on another side will projected like mirror
		// Dots using ONLY in 'draw' function
		this.dots = {passive:
					 [{x:-this.self.width/2, y:1},
					 {x:-this.self.width/2, y:0}
		 			 ],
		 			 
		 			 active:[
		 			 {x:0, y:1},
		 			 {x:0, y:0}
		 			 ]
		 			}

		this.progress = {progress:0, max:40} 			
		this.isActivated = false	
	}
	draw(){
		// Stop if progress of opening doors is zero
		if(this.progress.progress == 0){return}

		let dw = this.doorwidth*this.progress.progress/this.progress.max
		let x,y
		x = this.self.x
		y = this.self.y-this.self.height/2-dw
		

		let firstdot = this.dots.active[0]
		let seconddot = this.dots.active[1]
		ctx.lineWidth = 4
		// Left Door
		ctx.beginPath()
		
		ctx.moveTo(x+firstdot.x+this.x, y+firstdot.y*dw+this.y)
		for(let dot in this.dots.passive){
			dot = this.dots.passive[dot]
			ctx.lineTo(x+dot.x, y+dot.y*dw)
			ctx.moveTo(x+dot.x, y+dot.y*dw)
		}
		ctx.lineTo(x+seconddot.x+this.x, y+seconddot.y*dw+this.y)
		ctx.stroke()
		ctx.closePath()
	
		// Right Door
		ctx.beginPath()
		ctx.moveTo(x-(firstdot.x+this.x), y+firstdot.y*dw+this.y)
		for(let dot in this.dots.passive){
			dot = this.dots.passive[dot]
			ctx.lineTo(x-dot.x, y+dot.y*dw)
			ctx.moveTo(x-dot.x, y+dot.y*dw)
		}
		ctx.lineTo(x-(seconddot.x+this.x), y+seconddot.y*dw+this.y)
		ctx.stroke()
		ctx.closePath()

		ctx.lineWidth = 2

		// Inner
		ctx.fillStyle = "#102136"
		ctx.fillRect(x-this.self.width/2,y,this.self.width,dw)
		ctx.strokeRect(x-this.self.width/2,y,this.self.width,dw)
	}
	movedoors(){
		// Move Doors after Activation
		let width = this.self.width/2
		let progress = this.progress.progress/this.progress.max // Converted to precents

		this.x = (Math.sin(Math.PI/2+Math.PI*3/4*progress)-1)*width 
		this.y = (Math.cos(Math.PI/2+Math.PI*3/4*progress))*width
	}
	activatedoors(){
		// Listener To Watch Activation Of Doors
		let progress = this.progress.progress
		if(this.isActivated){
		if(progress<this.progress.max){
			this.progress.progress++
		}
		}
		else{
		if(progress>0){
			this.progress.progress--
		}
		}
	}
	animate(){
		this.activatedoors()
		this.movedoors()
		this.draw()
	}
}