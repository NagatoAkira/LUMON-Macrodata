class GameManager{
	constructor(){
		// To initialize Countainer Grid 
		this.initData = {}
		this.initData.rows = 35
		this.initData.columns = 35
		this.initData.scale = 40

		this.containerGrid = []
		this.digitBags = []

		this.init()

		this.activeDigitBag = null

		// To Move Map Using Mouse
		this.x = 0
		this.y = 0

		// To Scale Map
		this.scale = 1

		this.operations = {send:new SendOperation(this)}
		this.operations.restore = new RestoreOperation(this)
		this.operations.scale = new ScaleOperation(this)
		this.operations.background = new DrawBackground(this)
		this.operations.move = new MoveMap(this)
	}
	init(){
		let scale = this.initData.scale
		let rows = this.initData.rows
		let columns = this.initData.columns
		let x,y
		x = canvas.width/2-rows*scale/2+scale/2-0.1
		y = canvas.height/2-columns*scale/2+scale/2-0.1
		for(let i=0; i<rows; i++){
		for(let j=0; j<columns; j++){
			this.containerGrid.push(new DigitContainer(x+i*scale,y+j*scale))
		}
		}

		// Update Another Data for Digit Bags
		scale = 70
		y = 74
		x = canvas.width/2-scale*5*1.6/2+55
		for(let i=0; i<5; i++){
			this.digitBags.push(new DigitBag(x+i*scale*1.6, y+scale*4.8))
			this.digitBags[i].index = i+1
		}
	}
	update(){
		for(let cont in this.containerGrid){
			this.containerGrid[cont].update()
		}

		// Draw Background
		this.operations.background.update()

		ctx.font = "12px sans-serif"
		for(let bag in this.digitBags){
			this.digitBags[bag].update()
		}
		// Update operations
		this.operations.send.update()
		this.operations.restore.update()
		this.operations.scale.update()
		this.operations.move.update()
		
	}
}
class DrawBackground{
	constructor(self){
		this.self = self

		this.generalProgress = 0
	}
	countGeneralProgress(){
		// Count General Progress From Every Digit Bag
		let progress = 0
		for(let bag in this.self.digitBags){
			bag = this.self.digitBags[bag]
			progress += bag.progress
		}
		this.generalProgress = Math.round(progress/5)
	}
	drawUpperBorder(){
		let h = 60
		ctx.fillRect(0,0,canvas.width,h)
		ctx.strokeRect(-1,-1,canvas.width+2,h-5)

		// Decorative Line
		let gap = 3
		ctx.beginPath()
		ctx.moveTo(0,h-gap)
		ctx.lineTo(canvas.width,h-gap)
		ctx.stroke()
		ctx.closePath()

		// Draw File Name
		let gapX,gapY
		gapX = 30
		gapY = 15
		ctx.strokeRect(gapX,gapY,canvas.width-gapX*2, h-gapY*2)
		ctx.strokeStyle = colors.light
		ctx.font = "bold 22px sans-serif"
		ctx.lineWidth = 1
		ctx.strokeText(this.generalProgress.toString()+"% "+"Complete",canvas.width-gapX-200,h/2+7)
		ctx.fillStyle = colors.dark
		ctx.lineWidth = 2
	}
	drawLowerBorder(){
		ctx.strokeStyle = colors.light
		let h = 90
		ctx.fillRect(0,canvas.height-h,canvas.width,h)
		ctx.strokeRect(-1,canvas.height-h,canvas.width+2,h+1)

		// Decorative Line
		let gap = 3
		ctx.beginPath()
		ctx.moveTo(0,canvas.height-h+gap)
		ctx.lineTo(canvas.width,canvas.height-h+gap)
		ctx.stroke()
		ctx.closePath()
	}
	drawAllSent(){
		// Make Background not working ONLY for Sent Digits
		ctx.fillStyle = colors.light
		let sent = this.self.operations.send.allSent
		for(let obj in sent){
			obj = sent[obj]
			obj.update()
		}
		ctx.fillStyle = colors.dark
	}
	update(){
		this.countGeneralProgress()

		ctx.fillStyle = colors.dark

		this.drawUpperBorder()
		this.drawLowerBorder()
		this.drawAllSent()

		ctx.fillStyle = colors.light
	}
}
class MoveMap{
	constructor(self){
		this.self = self

		this.speed = 0

		this.x = 0
		this.y = 0

		// Block Statement
		this.block = null
	}
	stateBlockMovement(){
		let containers = this.self.containerGrid

		let first = containers[0].container
		let last = containers[containers.length-1].container

		let norm = getNormal(canvas.width/2, canvas.height/2,
							 mouse.x, mouse.y)

		let scl = this.self.scale
		let x,y
		x = canvas.width/2
		y = canvas.height/2
		let w,h
		w = (canvas.width-50)/scl
		h = canvas.height/2/scl

		let spd = this.speed
		let state01 = (x > first.x-norm.x*spd+w/2 && x < last.x-norm.x*spd-w/2)
		let state02 = (y > first.y-norm.y*spd+h/2+30/scl && y < last.y-norm.y*spd-h/2)
		
		this.block = {x:!state01, y:!state02}
	}
	countMoveSpeed(){
		// Count Speed Relative of Mouse Position
		let dist = getDistance(canvas.width/2, canvas.height/2,
							   mouse.x, mouse.y)
		let speed = {min:1.1, max:4}

		let min = 150
		if(dist > min){
			this.speed = speed.min
		}else{
			this.speed = 0
		}

		let max = 200
		this.speed *= (dist-min)/(max-min)*speed.max
		if(dist > max){
			this.speed = speed.max
		}
	}
	moveMap(){
		let block = this.block
		// Move Position in Map
		let norm = getNormal(canvas.width/2, canvas.height/2,
							 mouse.x, mouse.y)
		if(!block.x){
		this.self.x -= norm.x*this.speed
		}
		if(!block.y){
		this.self.y -= norm.y*this.speed
		}
	}
	updatePosition(){
		let containers = this.self.containerGrid
		for(let obj in containers){
			obj = containers[obj]
			let con = obj.container
			con.x -= this.x
			con.y -= this.y
			con.x += this.self.x
			con.y += this.self.y
		}
		this.x = this.self.x
		this.y = this.self.y
	}
	update(){
		this.stateBlockMovement()
		this.countMoveSpeed()
		this.moveMap()
		this.updatePosition()
	}
}
class ScaleOperation{
	constructor(self){
		this.self = self

		this.scale = this.self.scale

		// Variable to Scale UP or Scale DOWN
		this.direction = 0
	}
	resizeDigitContainers(){
		let containers = this.self.containerGrid
		for(let obj in containers){
			obj = containers[obj]
			obj.scale /= this.scale
			obj.scale *= this.self.scale
		}
	}
	moveGridBorders(){
		let containers = this.self.containerGrid
		let center = {x:canvas.width/2, y:canvas.height/2}
		for(let ob in containers){
			ob = containers[ob]
			let con = ob.container
			let obj = ob.object
			
			let dist = getDistance(center.x, center.y, con.x, con.y)
			let norm = getNormal(center.x, center.y, con.x, con.y)

			con.x = center.x + dist*norm.x/this.scale*this.self.scale
			con.y = center.y + dist*norm.y/this.scale*this.self.scale
			con.radius /= this.scale
			con.radius *= this.self.scale 

			obj.x = obj.x/this.scale*this.self.scale
			obj.y = obj.y/this.scale*this.self.scale
			let anim = ob.animation.shake.animation
			anim.speed /= this.scale
			anim.speed *= this.self.scale  
		}
	}
	refillSpeedVariables(){
		// Scale Also Speed Variables
		let containers = this.self.containerGrid
		for(let obj in containers){
			obj = containers[obj]
			let anim = obj.animation.shake.animation
			anim.speed /= this.scale
			anim.speed *= this.self.scale
		}
	}
	batchScalewithMovement(){
		// When scale up in corner of all area it goes out of it
		// So this method fix that
		let data = this.self.initData
		let precents = 0.25
		if(Math.abs(this.self.x) < data.scale * data.rows * precents *this.self.scale){
			return
		}
		if(Math.abs(this.self.x) < data.scale * data.columns * precents *this.self.scale){
			return
		}

		if(this.scale-this.self.scale > 0){
			this.self.x /= this.scale
			this.self.y /= this.scale 
		}
	}
	changeScaleVariable(){
		// To Scale Up or To Scale Down
		let predict = this.self.scale + this.direction
		if(predict > 1 && predict < 2.5){
			this.self.scale += this.direction
		}
	}
	update(){
		this.resizeDigitContainers()
		this.moveGridBorders()
		this.refillSpeedVariables()

		this.batchScalewithMovement()

		this.scale = this.self.scale

		this.changeScaleVariable()
	}

}
class RestoreOperation{
	constructor(self){
		this.self = self

		this.allSent = []

		this.init()
	}
	init(){
		for(let obj in this.self.containerGrid){
			obj = this.self.containerGrid[obj]
			obj.restoreTimer = new Timer(60*15)
		}
	}
	collectAllSent(){
		this.allSent = []
		for(let obj in this.self.containerGrid){
			obj = this.self.containerGrid[obj]
			if(obj.isSent){
				this.allSent.push(obj)
			}
		}
	}
	restoreDigit(){
		if(this.allSent[0]==null){return}

		for(let obj in this.allSent){
			obj = this.allSent[obj]
			obj.restoreTimer.activate()

			if(obj.restoreTimer.start == 0){
				obj.isSent = false
				obj.isVisible = true
				obj.object.digit = Math.round(Math.random()*10)%9+1
				obj.restoreTimer.restart()
				obj.object.x = 0
				obj.object.y = 0
				obj.animation.shake.generateRandomPosition()
				obj.animation.catch.animation.size = 0
			}
		}
	}
	update(){
		this.collectAllSent()
		this.restoreDigit()
	}
}
class SendOperation{
	constructor(self){
		this.self = self

		// To collect all catched and sent objects if they have active state
		this.allCatched = []
		this.allSent = []

		// Speed of Sending
		this.speed = 7

		// Send Operation Check Process
		this.inProcess = false
	}
	collectAllCatched(){
		if(!mouse.isClicked){return}

		for(let i in this.self.containerGrid){
			let obj = this.self.containerGrid[i]
			if(!obj.isVisible){continue}
			if(obj.isCatched){
				this.allCatched.push(obj)
				obj.isCatched = false
			}
		}
	}
	markAllSent(){
		if(!mouse.isClicked){return}
		if(this.self.activeDigitBag==null){
			this.allCatched = []
			return
		}
		if(this.allCatched[0]==null){
			return
		}
		for(let i in this.allCatched){
			let obj = this.allCatched[i]
			// Execute Fade Animation after Digit went to Bag
			obj.fadeTimer = new Timer(50)
			obj.isSent = true
			this.allSent.push(obj)
		}
		this.allCatched = []
	}
	sendAnimation(){
		let activebg = this.self.activeDigitBag
		if(activebg==null){return}

		let fadedistance = 70
		let hidedistance = 5
		
		for(let i in this.allSent){
			let obj = this.allSent[i]
			if(obj.isSent){
				let dir = getNormal(obj.container.x+obj.object.x,obj.container.y+obj.object.y,
									activebg.x, activebg.y)
				obj.object.x += dir.x * this.speed
				obj.object.y += dir.y * this.speed

				let dist = getDistance(obj.container.x+obj.object.x,obj.container.y+obj.object.y,
									   activebg.x, activebg.y)
				if(dist < fadedistance){
					obj.object.size *= (obj.fadeTimer.start/obj.fadeTimer.max)
					obj.fadeTimer.activate()
				}
				if(dist < hidedistance){
					obj.isVisible = false
					obj.fadeTimer.restart()
					delete this.allSent[i]

					this.self.activeDigitBag.increaseProgress(1)
				}
			}
		}
		this.allSent = this.allSent.filter(function(e){return e})
	}
	update(){
		this.collectAllCatched()
		this.markAllSent()
		this.sendAnimation()

		// Check Sending Process
		this.inProcess = (this.allSent[0]!=null)
	}
}