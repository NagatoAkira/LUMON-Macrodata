class GameOver{
	constructor(){ 
		this.button = new Button(canvas.width/2,canvas.height/2+75, 50, 50)
	}
	drawFinalMessage(){
		ctx.fillStyle = colors.light
		ctx.font = "12px sans-serif"
		ctx.fillText("Kier is proud of you", canvas.width/2-50, canvas.height/2+20)
		ctx.fillText("You made GREAT work", canvas.width/2-60, canvas.height/2+15+20)
	}
	update(){
		this.drawFinalMessage()
		this.button.update()
	}
}
class Button{
	constructor(x,y,width,height){
		this.x = x
		this.y = y

		this.width = width
		this.height = height

		this.isClicked = false
	}
	detectInteract(){
		// Button with Mouse Interaction
		let w = this.width
		let h = this.height

		let x = this.x
		let y = this.y
		let dist = getDistance(x,y,mouse.x,mouse.y)

		this.isClicked = false
		if(dist < (w>h ? h/2:w/2)){
			ctx.globalAlpha = 0.8
			if(mouse.isPressed){
				ctx.globalAlpha = 0.5
			}
			this.isClicked = mouse.isClicked
		}
	}
	draw(){
		ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height)
	}
	update(){
		this.detectInteract()
		this.draw()
		ctx.globalAlpha = 1
	}
}