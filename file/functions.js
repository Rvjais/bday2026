

// variables
var $win = $(window);
var clientWidth = $win.width();
var clientHeight = $win.height();

(function($) {
	$.fn.typewriter = function(speed, onComplete) {
		var intervalSpeed = typeof speed === 'number' ? speed : 22;
		var cb = typeof speed === 'function' ? speed : onComplete;
		this.each(function() {
			var $ele = $(this);
			var fullHtml = $ele.html();
			$ele.empty();
			
			var str = fullHtml;
			var progress = 0;
			var $cursor = $('<span class="typewriter-cursor">|</span>');
			$ele.append($cursor);
			
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current === '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				
				var currentText = str.substring(0, progress);
				$ele.html(currentText).append($cursor);
				
				if (progress >= str.length) {
					clearInterval(timer);
					setTimeout(function() {
						$cursor.fadeOut(400, function() { $cursor.remove(); });
					}, 200);
					if (typeof cb === 'function') {
						cb();
					}
				}
			}, intervalSpeed);
		});
		return this;
	};
})(jQuery);

function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "Days <span class=\"digit\">" + days + "</span> Hours <span class=\"digit\">" + hours + "</span> Minutes <span class=\"digit\">" + minutes; 
	$("#clock").html(result);

	var text = "THE WORLD JUST GOT LUCKIER SINCE ";
	$("#message-box").html(text);

}
