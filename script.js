canvas = document.querySelector("canvas")
ctx = canvas.getContext('2d')

canvas.height = 480
canvas.width = 640

function clearScene(){
	ctx.clearRect(0,0,canvas.width, canvas.height)
	ctx.fillStyle = "#00416a"
	ctx.fillRect(0,0,canvas.width, canvas.height)
}

var gamemanager = new GameManager()

ctx.fillStyle = "white"
ctx.font = "25px sans-serif"
var fps = 60 

function main(){
	setTimeout(()=>{
	window.requestAnimationFrame(main)
	}, 1000/fps)
	clearScene()
	ctx.fillStyle = "white"

	gamemanager.update()


	mouse.isClicked = false

}
onkeydown = function(event){
	// Scale Objects
	if(event.key == "+"){
		gamemanager.operations.scale.direction = 0.05
	}
	if(event.key == "-"){
		gamemanager.operations.scale.direction = -0.05
	}
}
onkeyup = function(event){
	// Stop Scale
	gamemanager.operations.scale.direction = 0
	//Regulate Activity of Digit Bags
	let index = parseInt(event.key)-1
	if(gamemanager.operations.send.inProcess){return}
	if(gamemanager.digitBags[index]==null){return}

	if(gamemanager.activeDigitBag!=null){
	if(gamemanager.activeDigitBag.index == index+1){
		gamemanager.activeDigitBag.isActivated = !gamemanager.activeDigitBag.isActivated
		gamemanager.activeDigitBag = null
		return
	}
	gamemanager.activeDigitBag.isActivated = false
	}
	gamemanager.activeDigitBag = gamemanager.digitBags[index]
	gamemanager.activeDigitBag.isActivated = true
}
main()
