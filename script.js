canvas = document.querySelector("canvas")
ctx = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

function clearScene(){
	ctx.clearRect(0,0,canvas.width, canvas.height)
}

var test = new DigitContainer(150,150)

ctx.fillStyle = "white"
console.log(ctx.font)
ctx.font = "25px sans-serif"
var fps = 60 

function main(){
	setTimeout(()=>{
	window.requestAnimationFrame(main)
	}, 1000/fps)
	clearScene()
	test.update()
	mouse.isClicked = false
}
main()
