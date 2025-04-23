class Timer{
	constructor(start){
		this.start = start
		this.max = start

		this.isStop = false
	}
	activate(){
		this.isStop = (this.start==0)
		if(!this.isStop){
			this.start--
		}
	}
	restart(){
		this.start=this.max
	}
	change(start){
		this.start = start
		this.max = start
	}
}