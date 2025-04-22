class GameManager{
	constructor(){
		// To initialize Countainer Grid 
		this.initData = {}
		this.initData.rows = 5
		this.initData.columns = 5
		this.initData.scale = 40

		this.containerGrid = []
		this.digitBags = []

		this.init()

		this.activeDigitBag = null

		this.scale = 1

		this.operations = {send:new SendOperation(this)}
		this.operations.restore = new RestoreOperation(this)
		this.operations.scale = new ScaleOperation(this)
	}
	init(){
		let scale = this.initData.scale
		let rows = this.initData.rows
		let columns = this.initData.columns
		let x,y
		x = canvas.width/2-scale*rows/2
		y = canvas.height/2-scale*columns/2
		for(let i=0; i<rows; i++){
		for(let j=0; j<columns; j++){
			this.containerGrid.push(new DigitContainer(x+i*scale,y+j*scale))
		}
		}

		// Update Another Data for Digit Bags
		scale = 70
		y = 80
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
		for(let bag in this.digitBags){
			this.digitBags[bag].update()
		}
		// Update operations
		this.operations.send.update()
		this.operations.restore.update()
		this.operations.scale.update()
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
			obj.restoreTimer = new Timer(60*10)
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