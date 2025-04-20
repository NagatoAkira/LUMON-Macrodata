function getDistance(x1,y1,x2,y2){
	return Math.sqrt((x2-x1)**2+(y2-y1)**2)
}
function getNormal(x1,y1,x2,y2){
	let x,y
	let dist = getDistance(x1,y1,x2,y2)
	x = (x2-x1)/dist
	y = (y2-y1)/dist
	return {x:x,y:y}
}