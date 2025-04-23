class DigitContainer{
	constructor(x=0,y=0){
		this.container = {x:x, y:y, radius:10}
		this.object = {x:0, y:0, digit:Math.round(Math.random()*10)%9+1, size:1}
		this.font = {size:12}

		this.animation = {shake:null}
		this.animation.shake = new IdleShakeAnimation(this.container,this.object)
		this.animation.size = new IdleDistanceSizeAnimation(this.container, this.object)
		this.animation.catch = new CatchAnimation(this)

		this.isCatched = false // Detect Mouse Interact With This Digit
		this.isSent = false // State To Stop Any Operations after Collecting Correct Digit Group
		this.isVisible = true // Just Visibility Of Object

		this.scale = 1
	}
	animate(){
		if(this.isSent){return}
		this.animation.shake.animate()
		this.animation.size.animate()
		this.animation.catch.animate()
	}
	resize(){
		// Stop Resize after Fully Catching
		if(!this.isSent){
		// All resize variables
		let size = this.animation.size.animation.size
		let catch_ = this.animation.catch.animation.size
		this.object.size = (size+catch_)*this.scale
		}

		ctx.font = "bold "+(this.font.size).toString()+"px sans-serif"
		ctx.font = "bold "+Math.round((this.font.size*this.object.size)).toString()+"px sans-serif"
	}
	checkVisibility(){
		let x,y
		x = this.container.x+this.object.x
		y = this.container.y+this.object.y
		this.isVisible = (x>0 && x<canvas.width && y>0 && y<canvas.height)
	}
	draw(){
		ctx.fillText(this.object.digit, this.container.x+this.object.x, this.container.y+this.object.y)
	}
	update(){
		if(!this.isVisible){return}

		this.resize()

		this.animate()
		this.draw()
	}
}
class CatchAnimation{
	constructor(self){
		this.self = self
		this.container = self.container
		this.object = self.object
		this.font = self.font

		this.animation = {size:0,speed:0.1, max:1.5}
	}
	resizeDigit(PositiveOrNegative = 1, minormax = 1){
		// Generally resize digit with your input data
		let num = PositiveOrNegative
		let size = this.animation.size
		let speed = this.animation.speed
		if(num>0){
			let max = minormax
			if(size+speed<max){
				this.animation.size+=speed
				return
			}
		}
		if(num<0){
			let min = minormax
			if(size>min){
				this.animation.size-=speed
				return
			}
		}
	}
	detectCatchState(){
		// Change state as catched with some operations
		if(this.animation.size > 0.5*this.animation.max){
			this.self.isCatched = true
		}
	}
	resizeOnMouseInteract(){
		// Resize when mouse touch digits
		let dist = getDistance(this.container.x+this.object.x+this.object.size*this.font.size/2, 
							   this.container.y+this.object.y-this.object.size*this.font.size/2,
							   mouse.x, mouse.y)
		if(mouse.isPressed){
		this.detectCatchState() // Detect Catch State For Parent Class
		if(dist < this.object.size*this.font.size){
			this.resizeDigit(1, this.animation.max)
		}
		}else{
			this.resizeDigit(-1, 0)
		}
	}
	animate(){
		this.resizeOnMouseInteract()	
	}
}
class IdleDistanceSizeAnimation{
	constructor(container,object){
		this.container = container
		this.object = object
	
		this.animation = {size:1,speed:0.05}

		this.font = {size:25}

		this.area = {min: 60, max:120}
	}
	resizeDigit(PositiveOrNegative = 1, minormax = 1){
		// Generally resize digit with your input data
		let num = PositiveOrNegative
		let size = this.animation.size
		let speed = this.animation.speed
		if(num>0){
			let max = minormax
			if(size+speed<max){
				this.animation.size+=speed
				return
			}
		}
		if(num<0){
			let min = minormax
			if(size>min){
				this.animation.size-=speed
				return
			}
		}
	}
	resizeUsingDifferentRadius(){
		// Resize using radius levels around your mouse
		let area = this.area
		let dist = getDistance(this.container.x+this.object.x,
							   this.container.y+this.object.y,
							   mouse.x, mouse.y)
		let rank = {min:1.2, max:1.8}
		if(dist<area.min){
			this.resizeDigit(1,rank.max)
			return
		}
		this.resizeDigit(-1,rank.min)
		if(dist<area.max){
			this.resizeDigit(1,rank.min)
			return
		}
		
		this.resizeDigit(-1,1)
	}
	animate(){
		this.resizeUsingDifferentRadius()
	}
}

class IdleShakeAnimation{
	constructor(container,object){
		this.container = container
		this.object = object

		this.animation = {position:{x:0,y:0},direction:{x:0,y:0},speed:0.1}

		this.generateRandomPosition()
	}
	move(x,y){
		this.object.x += x
		this.object.y += y
	}
	generateRandomPosition(){
		// Generate Random Direction and Position Around Radius of Digit Container
		let rad = this.container.radius 
		let pos = getNormal(0,0,
							Math.random().toFixed(2)*(-1)**(Math.round(Math.random())+1), 
							Math.random().toFixed(2)*(-1)**(Math.round(Math.random())+1))

		pos.x = pos.x*rad
		pos.y = pos.y*rad

		this.animation.position.x = pos.x
		this.animation.position.y = pos.y

		let dir = getNormal(this.object.x, this.object.y,
							pos.x, pos.y)
		this.animation.direction.x = dir.x
		this.animation.direction.y = dir.y
	}
	doMakeNewPositionGenerationForShake(){
		// Check Position Of Digit Object To Get Access of New Postion Generation 
		let pos1 = {x:0,y:0}
		pos1.x = this.object.x
		pos1.y = this.object.y
		let pos2 = {x:0,y:0}
		return (getDistance(pos1.x,pos1.y,pos2.x,pos2.y) > this.container.radius)
	}
	generateRandomPositionForShake(){
		// Generate New Position For Shake Effect
		if(this.doMakeNewPositionGenerationForShake()){
			this.generateRandomPosition()
		}
	}
	animate(){
		this.generateRandomPositionForShake()

		let dir = this.animation.direction
		let speed = this.animation.speed
		this.move(dir.x*speed, dir.y*speed)

		//ctx.fillRect(this.container.x-5, this.container.y-5,10,10)
	}
}