($(function () {
    var rawTime = document.URL.substring(document.URL.indexOf('?')+1);
    var toEnd = validateTime(rawTime);
    
    function validateTime(time) {
        if (time.indexOf(':') > -1) {
            var splitUp = time.split(':');
            if (splitUp.length === 3 || splitUp.length === 2) {
                splitUp.forEach(function (element, index, array) {
                    if (isNaN(parseInt(element))) return "error 1";
                    splitUp[index] = parseInt(element);
                });
                if (splitUp.length === 3) return splitUp;
                else {
                    splitUp.push(0);
                    return splitUp;
                }
            }
        }
        return "error 2";
    }
    
    function synthesizeTime(time) {
        var final = '';
        time.forEach(function (element, index, array) {
            if (element < 10) element = "0" + element;
            final = index > 0 ? final + ':' + element : element;
        });
        return final;
    }
    
    function getTimeDifference(time, origin) {
        var seconds = (time[0]*3600) + (time[1]*60) + time[2];
        if (typeof(origin) === 'undefined') {
            var d = new Date();
            originSeconds = (d.getHours()*3600) + (d.getMinutes()*60) + d.getSeconds();
        } else {
            originSeconds = (origin[0]*3600) + (origin[1]*60) + origin[2];
        }
        var difference = seconds - originSeconds;
            if (difference > 0) {
                var minutes = Math.floor(difference / 60);
                difference -= (minutes * 60);
                var hours = Math.floor(minutes / 60);
                minutes -= (hours * 60);
                return [hours, minutes, difference];
            } else {
                return false;
            }
    }
    
    function tick() {
        if (rawTime !== document.URL) {
            var diff = getTimeDifference(toEnd);
            if (diff) {
            	$('#timer').text(synthesizeTime(diff));
            	setTimeout(tick, 1);
            } else {
            	$('#timer').text('00:00:00');
            	flash(true);
            }
        } else {
            $('#timer').text('00:00:00');
            timerTick();
        }
    }

    function timerTick() {
        var d = new Date();
        var begin = [d.getHours(), d.getMinutes(), d.getSeconds()];
        function update() {
            var now = new Date();
            var diff = getTimeDifference([now.getHours(), now.getMinutes(), now.getSeconds()], begin);
            if (diff) $('#timer').text(synthesizeTime(diff));
            setTimeout(update, 1);
        }
        update();
    }

    function flash(black) {
    	if (black) {
    		document.bgColor = '#FF0000';
    		$('#timer').css('color', '#000000');
    	} else {
    		document.bgColor = '#FFFFFF';
    		$('#timer').css('color', '#FF0000');
    	}
    	setTimeout(function () { flash(!black) }, 1000);
    }

    tick();
}));