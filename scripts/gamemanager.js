class GameManager{
	constructor(){
		this.containerGrid = []
		this.digitBags = []

		this.activeDigitBag = null

		this.operations = {send:new SendOperation(this)}

		this.init()
	}
	init(){
		let x,y
		x = 150
		y = 150
		let scale = 70
		for(let i=0; i<5; i++){
		for(let j=0; j<5; j++){
			this.containerGrid.push(new DigitContainer(x+i*scale,y+j*scale))
		}
		}

		for(let i=0; i<5; i++){
			this.digitBags.push(new DigitBag(x+i*scale*2.5, 600))
			this.digitBags[i].index = i+1
		}
		// Define Current Active Digit Bag
		this.activeDigitBag = this.digitBags[0]
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
	}
}
class SendOperation{
	constructor(self){
		this.self = self

		this.allCatched = []

		this.speed = 7
	}
	collectAllCatched(){
		if(mouse.isClicked){
		//this.allCatched = []
		for(let i in this.self.containerGrid){
			let obj = this.self.containerGrid[i]
			if(!obj.isVisible){continue}

			if(obj.isCatched){
				this.allCatched.push(obj)
			}
		}
		}

		// TEST
		if(mouse.isClicked){
		if(this.self.activeDigitBag!=null){
		if(this.allCatched[0]!=null){
		for(let i in this.allCatched){
			let obj = this.allCatched[i]
			obj.isSent = true
		}
		}
		}
		}
	}
	sendAnimation(){
		let activebg = this.self.activeDigitBag
		if(activebg==null){return}

		let fadedistance = 5
		
		for(let obj in this.allCatched){
			obj = this.allCatched[obj]
			if(obj.isSent){
				let dir = getNormal(obj.container.x+obj.object.x,obj.container.y+obj.object.y,
									activebg.x, activebg.y)
				obj.object.x += dir.x * this.speed
				obj.object.y += dir.y * this.speed

				let dist = getDistance(obj.container.x+obj.object.x,obj.container.y+obj.object.y,
									   activebg.x, activebg.y)
				if(dist < fadedistance){
					obj.isVisible = false
				}
			}
		}
	}
	update(){
		this.collectAllCatched()
		this.sendAnimation()
	}
}