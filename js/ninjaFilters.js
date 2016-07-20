ninjaApp.filter('formatSeconds',function(){

    function formatSeconds(seconds){

        seconds = Math.round(seconds);

        if(seconds == 9999999){
            return "";
        }

        var toPrint = "";

        //More than a day
        if (seconds >= 86400){
            var days = ~~(seconds / 86400);
            toPrint += days + "d ";
            seconds -= days * 86400;
        }
        //More than a hour
        if (seconds >= 3600){
            var hours = ~~(seconds / 3600);
            toPrint += hours + "h ";
            seconds -= hours*3600;
        }
        if (seconds >= 60){
            var minutes = ~~(seconds / 60);
            toPrint += minutes + "m ";
            seconds -= minutes*60
        }
        if (seconds > 0){
            toPrint += seconds + "s";
        }

        return toPrint;
    }

    return formatSeconds;
});

ninjaApp.filter('secondsToDateTime', function (){
    return function(seconds){
        return new Date(1970, 0, 1).setSeconds(seconds);
    }
});