/* EASY ONLINE UGLIFICATION           */
/* http://marijnhaverbeke.nl/uglifyjs */

var $data = new Object();
$data["01"] = "Packers Won The Super Bowl! Packers! Whoo!";
$data["02"] = "Packers Whoo!";
$data["03"] = "Packers! Packers!";
$data["04"] = "Yeah, Packers Won.";
$data["05"] = "Please, if y'all just go back to your drinkin'";
$data["06"] = "Ooh. Go Packers!";
$data["07"] = "Packers Won The Super Bowl! Whoo!";
$data["08"] = "Packers! Packers! Packers Won The Super Bowl";
$data["09"] = "Packer, Packer?";
$data["10"] = "Yeah, Packers!";
$data["11"] = "Packers Packers";
$data["12"] = "Packers Whoo!";
$data["13"] = "Packers.";
$data["14"] = "Packers?";
$data["15"] = "Dedicated to the Memory of 'Crazylegs' Elroy Hirsch.";
$data["16"] = "Go Packers.";
$total = 16;

Zepto(function(){
	$.each($data, function($key, $value){
		var $audio = new Audio();
		$($audio).append(jAudio($key, "mp3")).append(jAudio($key, "ogg"));
		$("body").append($audio);
		$("#soundboard").append(
			$("<li />").html($value).bind("click", function(){
				if($audio.paused == false) {
					$audio.currentTime = 0.01;
				}
				$audio.play();
			})
		);
		if($("li").length == $total) jRender();
	});
	$("body").bind("orientationchange", jRender); //orientation change
	$(window).bind("load", jRender);			  //font load
	$(window).bind("resize", jRender);			  //font load
});

// Input $n:number $f:filetype
function jAudio($n, $f) {
	var $t = $f == "ogg" ? "ogg" : "mpeg";
	return $("<source />").attr({src:"audio/"+$n+"."+$f, type:"audio/"+$t});
}

function jRender() {
	var $width = $(window).width();
	$("body").width($width); //iOS expands width on orientation change
	var $orientation = "wide"
	var $columns = 4;
	var $size = 4;
	if ($width < 500) {
		if (typeof(orientation) != "undefined" &&  orientation % 180 == 0) {
			$columns = 2;
			$size = 3;
			$("li").css('font-size', '16px');
		} else {
			$columns = 3;
			$size = 2;
			$("li").css('font-size', '10px');
		}
	}
	$("li").css({
		borderWidth: $size+"px",
		margin: $size+"px",
		padding: ($size * 2)+"px",
		width: ($width/$columns - ($size * 8))+"px"
	});
	if($columns == 4) {
		jSize();
	} else {
		jFlow($columns, $size);
	}
	
}

function jFlow($columns, $size) {
	var $map = new Array;
	var $items = $("li");
	$("li").each(function($index){
		if ($index < $columns) {
			$(this).css({position: "relative", top: "", left: ""});
			$map.push($(this).offset());
		} else {
			var $i = 0;
			for ($j = 1; $j < $map.length; $j++) {
				if ($map[$i]["top"] + $map[$i]["height"] > $map[$j]["top"] + $map[$j]["height"]) {
					$i = $j;
				}
			}
			$(this).css({position: "absolute", top: ($map[$i]["top"] + $map[$i]["height"]) + "px", left: $map[$i]["left"] - $size + "px"});
			$map.splice($i, 1, $(this).offset());
		}
	});
}

function jSize() {
	var $height = $(window).height();
	var $li = $("li");
	$li.css("height", ($height/4 - 32)+"px"); 
	
	var $first = $li.first();
	$first.css("font-size", 1);
	var $height = $first.attr("scrollHeight");
	var $width = $first.attr("scrollWidth");
	$first.css("font-size", '');
	
	$("li").each(function($index){
		var $this = $(this).css("overflow", "auto");
		var $adjust = ($this.attr("scrollHeight") <= $height && $this.attr("scrollWidth") <= $width) ? 1 : -1;
		var $size = parseFloat($this.css("font-size"));
		if ($adjust === 1) {
			while ($this.attr("scrollHeight") <= $height && $this.attr("scrollWidth") <= $width) {
				$this.css("font-size", $size += $adjust);
			}
		} else {
			while ($this.attr("scrollHeight") > $height || $this.attr("scrollWidth") > $width) {
				$this.css("font-size", $size += $adjust);
			}
		}
		$this.css("font-size", $size - 2);
		$(this).css("overflow", "hidden");
	});
	
}