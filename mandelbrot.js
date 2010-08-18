function calPixel(complex) {
    var count;
    var real = 0.0;
    var imag = 0.0;
    for (count = 0; count < 255; count++) {
        var newReal = complex['real'] + ((real * real) - (imag * imag));
        var newImag = complex['imag'] + (2 * real * imag);
        var lengthSq = (newReal * newReal) + (newImag * newImag);
        if (lengthSq >= 4.0) {
            return count;
        }
        real = newReal;
        imag = newImag;
    }
    return count;
}

function buildPic(dispWidth, dispHeight, realMin, imagMin, scaleReal, scaleImag, pic) {
    for(var i = 0; i < dispWidth; i++) {
        for (var j = 0; j < dispHeight; j++) {
            var real = realMin + (i * scaleReal);
            var imag = imagMin + (j * scaleImag);
            var complex = { 'real':real, 'imag':imag};
            pic[pic.length] = calPixel(complex);
        }
    }
    return pic;
}
function draw(dispWidth, dispHeight, colorMap, pic) {
    var canvas = document.getElementById("c");
    var context = canvas.getContext("2d");
    // Create an ImageData object.
    var imgd = context.createImageData(dispWidth, dispHeight);
    var i = 0;
    for (var j = 0; j < imgd.data.length; j += 4) {
        var rgb = colorMap[pic[i++]];
        if (rgb) {
            imgd.data[j] = rgb[0];
            imgd.data[j + 1] = rgb[1];
            imgd.data[j + 2] = rgb[2];
            imgd.data[j + 3] = 255;
        }
    }
    context.putImageData(imgd, 0, 0);
}

function mandelbrot(colorMap, dispWidth, dispHeight, realMin, realMax, imagMin, imagMax) {
    var scaleReal = (realMax - realMin) / dispWidth;
    var scaleImag = (imagMax - imagMin) / dispHeight;
    var pic = new Array();
    buildPic(dispWidth, dispHeight, realMin, imagMin, scaleReal, scaleImag, pic);
    draw(dispWidth, dispHeight, colorMap, pic);
}

$(document).ready(function() {
    $.ajax({
        url: 'neon.txt',
        type: 'GET',
        success: function(data) {
            var lines = data.split("\n");
            var colorMap = new Array();
            $.each(lines,
                    function(index, line) {
                        line = line.split(" ");
                        var RGB = new Array();
                        for (var j = 0; j < line.length; j++) {
                            if (line[j] != "") {
                                RGB[RGB.length] = parseInt(line[j]);
                            }
                        }
                        if (RGB.length == 3) {
                            colorMap[colorMap.length] = RGB;
                        }
                    });
            mandelbrot(colorMap, 400, 400, -0.7801785714285, -0.7676785714285, -0.1279296875000, -0.1181640625000);
        },
        error: function(e) {
            alert(e);
        }
    });
});
