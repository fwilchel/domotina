/**
 * Created by kaosterra on 15/04/15.
 */
showAlarms = function () {
    $('#alarms').show();
    $('#events').hide();

    $('#alarms_tab').addClass('active');
    $('#events_tab').removeClass('active');
};

showEvents = function () {
    $('#alarms').hide();
    $('#events').show();

    $('#events_tab').addClass('active');
    $('#alarms_tab').removeClass('active');
};

sensorStatus = function (sensor) {
    if (window.time && sensor.events) {
        var event;
        for (var n in sensor.events) {
            if (sensor.events.hasOwnProperty(n)) {
                event = sensor.events[n];
                if (event.timestamp < time) {
                    sensor.url = event.url;
                    sensor.status = event.status;
                    sensor.posX = event.posX;
                    sensor.posY = event.posY;
                    break;
                }
            }
        }
    }
};

isValid = function (sensor) {
    var floor = window.floor, time = window.time;
    return ((!floor || sensor.floor === floor.number) && (!time || sensor.creationDate < time));
};

function showIcons() {
    var c = document.getElementById("place_canvas");
    var ctx = c.getContext("2d");

    function drawSensor(sensor) {
        var image = new Image();
        image.src = sensor.url;
        ctx.drawImage(image, sensor.posX, sensor.posY);
    }

    var sensors = window.sensors, sensor;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i in sensors) {
        if (sensors.hasOwnProperty(i)) {
            sensor = $.extend({}, sensors[i]);
            if (isValid(sensor)) {
                sensorStatus(sensor);
                drawSensor(sensor);
            }
        }
    }
    showZoom();
}
$(showIcons);
$(window).load(showIcons);
$(function () {
    $("#popup-panel").hide();
});

$("#place_canvas").on("click", function (event) {
    var sensors = window.sensors, sensor;
    var area = 34; //tamaño de las imágenes de los sensores
    var modal = $("#popup-panel");
    var body = $("#popup-sensor");

    if (typeof event.offsetX === "undefined" || typeof event.offsetY === "undefined") {
        var targetOffset = $(event.target).offset();
        event.offsetX = event.pageX - targetOffset.left;
        event.offsetY = event.pageY - targetOffset.top;
    }

    for (var i in sensors) {
        if (sensors.hasOwnProperty(i)) {
            sensor = $.extend({}, sensors[i]);
            if (isValid(sensor)) {
                sensorStatus(sensor);
                if ((sensor.posX <= event.offsetX && event.offsetX <= sensor.posX + area) &&
                    (sensor.posY <= event.offsetY && event.offsetY <= sensor.posY + area)) {
                    body.html("Sensor on " + (sensor.description || "Private Asset") + "<br/>Status: " + sensor.status);
                    modal.show();
                    return;
                }
            }
        }
    }
    modal.hide();
});

$("#place_canvas").on('mousemove', function(evt){
    var x = evt.pageX - $(evt.target).offset().left;
    var y = evt.pageY - $(evt.target).offset().top;

    var xFin = evt.pageX;
    var yFin = evt.pageY;

    var mapImg = $('.map.center-block').css('background-image');
    mapImg = mapImg.replace('url(','').replace(')','').replace('"', '').replace('"','');


   for(var i=0, j = zoom.length; i < j; i++){
        if(x >= zoom[i].posX && x <= zoom[i].posX+30 && y >= zoom[i].posY && y <= zoom[i].posY+30){
                $('#zoom').remove();
                var zoomed = $('<div id="zoom">');
                zoomed.css({
                    'position' : 'absolute',
                    'top' : (yFin+20) + 'px',
                    'left' : (xFin+20) + 'px',
                    'border' : 'solid 3px #000',
                    'width' : '300px',
                    'height' : '300px',
                    'overflow' : 'hidden'
                });

                $('body').append(zoomed);

                var canvasZoom = $('<canvas width="350" height="200">');
                zoomed.append(canvasZoom);
                var ctxZoom = canvasZoom[0].getContext("2d");
                var img = new Image();
                img.src = mapImg;

                var imgWidth = img.width;
                var imgHeight = img.height;

                var xFactor = imgWidth / 700;
                var yFactor = imgHeight / 395;

                ctxZoom.drawImage(img, zoom[i].posX * xFactor, zoom[i].posY*yFactor, zoom[i].width_zoom, zoom[i].height_zoom, 0 , 0, 350 , 200);

                var sensors = window.sensors;

                for(var k=0, le=sensors.length; k < le; k++){
                    var sensor = sensors[k];
                    var image = new Image();
                    image.src = sensor.url;
                    ctxZoom.drawImage(image, ((sensor.posX) - (zoom[i].posX)) * xFactor, ((sensor.posY) - (zoom[i].posY)) * yFactor, 15, 15);
                }
                break;
        }
        $('#zoom').remove();
    }
});

var showZoom = function(data){
    var current = data || zoom;
    var c = document.getElementById("place_canvas");
    var ctx = c.getContext("2d");
    for(var i=0,j=current.length; i < j; i++){
        var imageInfo = current[i];
        var image = new Image();
        image.src = 'http://png-3.findicons.com/files/icons/2338/reflection/128/zoom_in.png';
        ctx.drawImage(image, imageInfo.posX, imageInfo.posY, 30, 30);
    }

}