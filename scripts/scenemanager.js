class SceneManager{
	constructor(gamemanager, gameover){
		this.gamemanager = gamemanager
		this.gameover = gameover

		this.transition = {}
		this.transition.timer = new Timer(20)
		this.transition.progress = 0

		this.wait = {}
		this.wait.timer = new Timer(10)

		this.isGameOver = false
		this.isRestartGame = false
	}
	transitionUpdate(){
		this.transition.timer.activate()

		let max = this.transition.timer.max/2
		let curr = this.transition.timer.start
		let progress = 1-Math.abs((curr-max)/max)
		this.transition.progress = progress

		ctx.globalAlpha = progress
		ctx.fillRect(0,0,canvas.width,canvas.height)
		ctx.globalAlpha = 1
	}
	registerGameOver(){
		if(!this.isGameOver && this.gamemanager.isGameOver && this.transition.timer.isStop){
			this.transition.timer.restart()
		}
		if(!this.isGameOver && this.gamemanager.isGameOver && this.transition.progress>=1){
			this.isGameOver = true
		}
	}
	restartGame(){
		if(this.isGameOver && this.isRestartGame && this.transition.progress>=1){
			gamemanager = new GameManager()
			this.gamemanager = gamemanager
			this.isGameOver = false
			this.isRestartGame = false
		}
		if(this.isGameOver && this.gameover.button.isClicked && this.transition.timer.isStop && this.wait.timer.isStop){
			this.transition.timer.restart()
			this.wait.timer.restart()
			this.isRestartGame = true
		}
	}
	update(){
		this.registerGameOver()
		this.restartGame()

		this.wait.timer.activate()
		if(this.wait.timer.isStop){
		if(!this.isGameOver){
		this.gamemanager.update()
		}else{
		this.gameover.update()
		}
		}
		this.transitionUpdate()
	}
}