// Software License Agreement (ISC License)
//
// Copyright (c) 2019, Matthew Voss
//
// Permission to use, copy, modify, and/or distribute this software for
// any purpose with or without fee is hereby granted, provided that the
// above copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

var test = require('test-kit').tape()
var buf2str = require('.')

test('buf2str', function (t) {
  t.table_assert([
    [ 'v',                                         'maxchars',             'exp' ],
    [ null,                                         8,                     null ],
    [ [],                                           8,                     [] ],
    [ [97,98,99],                                   8,                     'abc' ],
    [ Buffer.from('abcdefgh'),                      8,                     'abcdefgh' ],
    [ Buffer.from('abcdefgh'),                      7,                     'abcdefg..' ],
    [ Buffer.from('abcdefghi'),                     8,                     'abcdefgh..' ],
    [ [1,2,3,4,5],                                  8,                     'x01020304' ],
    [ [1,2,3,4,5],                                  null,                  'x0102030405' ],
    [ [1,2,3,4,500],                                8,                     [1,2,3,4,500] ],
    [ [0xAB, 0xFF],                                 8,                     'xABFF' ],
    [ { type: 'Buffer', data: [0xAB, 0xFF] },       8,                    'xABFF' ],
    [ Uint8Array.from([0xAB, 0xFF]),                8,                     'xABFF' ],
    [ Buffer.from([0xAB, 0xFF]),                    8,                     'xABFF' ],
    [ { a: 'hi', b: ['x', 'y']},                    8,                     {"a":"hi","b":["x","y"]} ],
    [ 23 ,                                          8,                     23 ],
  ], buf2str)
})


test('stringify', function (t) {
  t.table_assert([
    [ 'v',    'opt',  'exp' ],
    [ 33,     null,    '33' ],
    [ {id: Buffer.from('abcdefghijk')},     null,    '{"id":"abcdefgh.."}' ],
    [ {id: Buffer.from('abcdefghijk')},     {spacer: 2},    '{\n  "id": "abcdefgh.."\n}' ],
    [ {id: Buffer.from('abcdefghijk')},     {buf_maxchars: 4},    '{"id":"abcd.."}' ],
    [ {id: Buffer.from([0,220,240])},       {buf_maxchars: 4},    '{"id":"x00DC"}' ],
  ], buf2str.stringify)
})