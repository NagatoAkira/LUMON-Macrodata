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