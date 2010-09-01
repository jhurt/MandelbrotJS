//Copyright (c) 2010, Jason Hurt
//All rights reserved.
//
//Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//    * Neither the name of the Jason Hurt, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
//
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

function draw(dispWidth, dispHeight, colorMap, picMap) {
    var canvas = document.getElementById("c");
    var context = canvas.getContext("2d");
    // Create an ImageData object.
    var imgd = context.createImageData(dispWidth, dispHeight);

    //flatten map into an array
    var length = 0;
    $.each(picMap, function(column, i) {
        length++
    });
    var pic = new Array();
    for (var i = 0; i < length; i++) {
        var c = picMap[i];
        $.each(c, function (j, p) {
            pic[pic.length] = p;
        });
    }

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

function mandelbrotPar(numWorkers, colorMap, dispWidth, dispHeight, realMin, realMax, imagMin, imagMax) {
    var scaleReal = (realMax - realMin) / dispWidth;
    var scaleImag = (imagMax - imagMin) / dispHeight;
    var k=dispWidth/numWorkers;
    var picMap = new Object();
    for (var i = 0; i < dispWidth; i+=k) {
        var slave = new Worker('slave.js');
        var msg = {'x':i,'num':k,'dispHeight':dispHeight,'realMin':realMin,'realMax':realMax,
            'imagMin':imagMin,'imagMax':imagMax,'scaleReal':scaleReal,'scaleImag':scaleImag};
        slave.postMessage(msg);
        slave.onmessage = function(e) {
            var data = e.data;
            picMap[data['x']] = data.column;
            var length = 0;
            $.each(picMap, function(column, i) {
                length++
            });
            if (length == dispWidth) {
                draw(dispWidth, dispHeight, colorMap, picMap);
                $('#btnM').attr('disabled', false);
            }
        };
    }
}

$(document).ready(function() {
    $('#btnM').click(function(e) {
        e.preventDefault();
        $('#btnM').attr('disabled', true);
        $.ajax({
            url: 'neon.txt',
            type: 'GET',
            contentType: 'text/plain; charset=utf-8',
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
                var wh = parseInt($('#wh').val());
                var ww = parseInt($('#ww').val());
                if (ww > wh || wh % ww != 0) {
                    alert('# of workers must evenly divide width/height');
                    $('#btnM').attr('disabled', false);
                }
                else {
                    document.getElementById('c').width = wh;
                    document.getElementById('c').height = wh;
                    mandelbrotPar(ww,colorMap,wh, wh, parseFloat($('#rMin').val()),
                            parseFloat($('#rMax').val()),parseFloat($('#iMin').val()),
                            parseFloat($('#iMax').val()));
                }
            }
        });
    });
});
