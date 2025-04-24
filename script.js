canvas = document.querySelector("canvas")
ctx = canvas.getContext('2d')

canvas.height = 480
canvas.width = 640

var colors = {dark:"#102136", light:"#c2fffe"}

// Get Logo Image
var logo = new Image()
logo.src = "lumon.svg"

function clearScene(){
	ctx.clearRect(0,0,canvas.width, canvas.height)
	ctx.fillStyle = "#102136"
	ctx.fillRect(0,0,canvas.width, canvas.height)
}
var gamemanager = new GameManager()
var gameover = new GameOver()
var scenemanager = new SceneManager(gamemanager, gameover)

var fps = 60 

function main(){
	setTimeout(()=>{
	window.requestAnimationFrame(main)
	}, 1000/fps)
	clearScene()
	ctx.fillStyle = "#c2fffe"

	scenemanager.update()

	mouse.isClicked = false
}
main()
