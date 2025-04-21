canvas = document.querySelector("canvas")
ctx = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

function clearScene(){
	ctx.clearRect(0,0,canvas.width, canvas.height)
}

var gamemanager = new GameManager()

var test001 = new DigitBag(150,600)

ctx.fillStyle = "white"
console.log(ctx.font)
ctx.font = "25px sans-serif"
var fps = 60 

function main(){
	setTimeout(()=>{
	window.requestAnimationFrame(main)
	}, 1000/fps)
	clearScene()
	gamemanager.update()

	test001.update()
	mouse.isClicked = false
}
onkeydown = function(event){
	let index = parseInt(event.key)-1
	if(gamemanager.digitBags[index]!=null){
		if(gamemanager.activeDigitBag.index == index+1){
			gamemanager.activeDigitBag.isActivated = !gamemanager.activeDigitBag.isActivated
			return
		}
		gamemanager.activeDigitBag.isActivated = false
		gamemanager.activeDigitBag = gamemanager.digitBags[index]
		gamemanager.activeDigitBag.isActivated = true
	}
}
main()
