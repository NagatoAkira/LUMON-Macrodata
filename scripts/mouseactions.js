var mouse = {x:0,y:0, isClicked:false, isPressed:false}

onmouseup = function(event){
	mouse.isClicked = true
	mouse.isPressed = false
}
onmousedown = function(event){
	mouse.isPressed = true
}
onmousemove = function(event){
	mouse.x = event.clientX
	mouse.y = event.clientY
}