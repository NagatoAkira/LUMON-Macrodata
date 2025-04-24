var mouse = {x:0,y:0, isClicked:false, isPressed:false}

onmouseup = function(event){
	mouse.isClicked = true
	mouse.isPressed = false
}
onmousedown = function(event){
	mouse.isPressed = true
}
onmousemove = function(event){
	mouse.x = event.clientX - window.innerWidth/2 + canvas.width/2
	mouse.y = event.clientY - window.innerHeight/2 + canvas.height/2
}
onmousewheel = function(event){
	let dir = event.deltaY/Math.abs(event.deltaY)
	gamemanager.operations.scale.direction = 0.05*dir
}