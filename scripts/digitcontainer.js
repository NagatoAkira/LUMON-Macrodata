class DigitContainer{
	constructor(x=0,y=0){
		this.container = {x:x, y:y, radius:20}
		this.object = {x:0, y:0, digit:"5"}

		this.animation = {shake:null}
		this.animation.shake = new IdleShakeAnimation(this.container,this.object)
		this.animation.size = new ChangeSizeAnimation(this.container, this.object)
	}
	animate(){
		this.animation.shake.animate()
		this.animation.size.animate()
	}
	draw(){
		ctx.fillText(this.object.digit, this.container.x+this.object.x, this.container.y+this.object.y)
	}
	update(){
		this.animate()
		this.draw()
	}
}
class ChangeSizeAnimation{
	constructor(container,object){
		this.container = container
		this.object = object
	
		this.animation = {size:1,distance:50,speed:0.05}

		this.max = {size:2.5}
		this.min = {size:1}

		this.font = {size:25}
	}
	isNearbyMouse(){
		// Check is Nearby Mouse Position To Digit
		let dist = getDistance(this.container.x + this.object.x,this.container.y + this.object.y,
							   mouse.x,mouse.y)
		return (dist < this.animation.distance)
	}
	isMaxSize(){
		// Check Now Is Maximum Size
		let size = this.animation.size
		let speed = this.animation.speed
		return (this.max.size-speed > size)
	}
	isMinSize(){
		// Check Now Is Minimum Size
		let size = this.animation.size
		let speed = this.animation.speed
		return (this.min.size < size)
	}
	regulateDigitObject(){
		// Increase Object if Mouse is Nearby
		// And Decrease if Mouse is Far 
		let speed = this.animation.speed
		if(this.isNearbyMouse()){
		if(this.isMaxSize()){
			this.animation.size += speed
		}
		}
		else{
		if(this.isMinSize()){
			this.animation.size -= speed
		}
		}
	}
	animate(){
		// ATTENTION!
		// FIX THIS MOMENT WITH FALSE CHANGES
		ctx.font = (this.font.size*this.animation.size).toString()+"px sans-serif"
		console.log(ctx.font)
		this.regulateDigitObject()
		ctx.font = (this.font.size).toString()+"px sans-serif"
	}
}

class IdleShakeAnimation{
	constructor(container,object){
		this.container = container
		this.object = object

		this.animation = {position:{x:0,y:0},direction:{x:0,y:0},speed:0.25}

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

		pos.x = this.container.x + pos.x*rad
		pos.y = this.container.y + pos.y*rad

		this.animation.position.x = pos.x
		this.animation.position.y = pos.y

		let dir = getNormal(this.container.x+this.object.x, this.container.y+this.object.y,
							pos.x, pos.y)
		this.animation.direction.x = dir.x
		this.animation.direction.y = dir.y
	}
	doMakeNewPositionGenerationForShake(){
		// Check Position Of Digit Object To Get Access of New Postion Generation 
		let pos1 = {x:0,y:0}
		pos1.x = this.container.x+this.object.x
		pos1.y = this.container.y+this.object.y
		let pos2 = {x:0,y:0}
		pos2.x = this.animation.position.x
		pos2.y = this.animation.position.y
		return (getDistance(pos1.x,pos1.y,pos2.x,pos2.y) < this.animation.speed)
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

		ctx.fillRect(this.container.x-5, this.container.y-5,10,10)
	}
}