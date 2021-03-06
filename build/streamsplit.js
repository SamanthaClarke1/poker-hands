/*
Copyright (c) 2017, Matteo Collina <hello@matteocollina.com>
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
'use strict';
var through = require('syncthrough');
var StringDecoder = require('string_decoder').StringDecoder;
function transform(chunk) {
    this._last += this._decoder.write(chunk);
    if (this._last.length > this.maxLength) {
        this.emit('error', new Error('maximum buffer reached'));
        return;
    }
    var list = this._last.split(this.matcher);
    this._last = list.pop();
    for (var i = 0; i < list.length; i++) {
        push(this, this.mapper(list[i]));
    }
}
function flush() {
    // forward any gibberish left in there
    this._last += this._decoder.end();
    if (this._last) {
        push(this, this.mapper(this._last));
    }
}
function push(self, val) {
    if (val !== undefined) {
        self.push(val);
    }
}
function noop(incoming) {
    return incoming;
}
function split(matcher, mapper, options) {
    // Set defaults for any arguments not supplied.
    matcher = matcher || /\r?\n/;
    mapper = mapper || noop;
    options = options || {};
    // Test arguments explicitly.
    switch (arguments.length) {
        case 1:
            // If mapper is only argument.
            if (typeof matcher === 'function') {
                mapper = matcher;
                matcher = /\r?\n/;
                // If options is only argument.
            }
            else if (typeof matcher === 'object' && !(matcher instanceof RegExp)) {
                options = matcher;
                matcher = /\r?\n/;
            }
            break;
        case 2:
            // If mapper and options are arguments.
            if (typeof matcher === 'function') {
                options = mapper;
                mapper = matcher;
                matcher = /\r?\n/;
                // If matcher and options are arguments.
            }
            else if (typeof mapper === 'object') {
                options = mapper;
                mapper = noop;
            }
    }
    var stream = through(transform, flush);
    stream._last = '';
    stream._decoder = new StringDecoder('utf8');
    stream.matcher = matcher;
    stream.mapper = mapper;
    stream.maxLength = options.maxLength;
    return stream;
}
module.exports = split;
