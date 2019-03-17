var config = {
    muted: true,
	controls : true,      
	height:'100%', 
	width:'100%',
    loop : true,
    fluid: true
}

var YJ_Player = videojs('YJ-Player', config, function () {
    this.play(); // if you don't trust autoplay for some reason  
})