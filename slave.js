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
