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

onmessage = function (event) {
    var data = event.data;
    var x = data['x'];
    for (var i = 0; i < data['num']; i++,x++) {
        var column = new Array();
        for (var j = 0; j < data['dispHeight']; j++) {
            var real = data['realMin'] + (x * data['scaleReal']);
            var imag = data['imagMin'] + (j * data['scaleImag']);
            var complex = { 'real':real, 'imag':imag};
            column[column.length] = calPixel(complex);
        }
        var d = new Object();
        d['x']=x;
        d['column'] = column;
        postMessage(d);
    }
};
