// Software License Agreement (ISC License)
//
// Copyright (c) 2018, Matthew Voss
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


// array lookup of printable ascii chars
var ASCII = (function () {
  var ret = new Uint8Array(256).fill(0)
  for (var i=32; i <= 127; i++) {
    ret[i] = 1
  }
  return ret
})()

// return 'buf', 'arr', 'view', or null (not an array type)
function arr_type (v) {
  if (Buffer.isBuffer(v)) {
    return 'buf'
  } else if (Array.isArray(v)) {
    return 'arr'
  } else if (ArrayBuffer.isView(v)) {
    return 'view'
  } else {
    return null
  }
}

// return 'ascii', 'hex', or null (for objects or arrays with non-byte values)s
function arr_format (v) {
  switch (arr_type(v)) {
    case 'arr':
      // check that values are bytes
      for (var i=0; i < v.length; i++) {
        if (typeof v[i] !== 'number' || v[i] < 0 || v[i] > 0xFF) {
          return null
        }
      }
      break
    case 'buf': case 'view':
    break
    default:
      return null
  }

  // check if all values are ascii
  for (var j = 0; j < v.length; j++) {
    if (ASCII[v[j]] === 0) {
      return 'hex'
    }
  }
  return 'ascii'
}

function buf2str (v, maxchars) {
  if (!v) { return null }
  if (v.length === 0) { return [] }
  if (maxchars == null) { maxchars = Infinity }
  if (v.type === 'Buffer' && v.data) {
    v = v.data
  }
  var ret
  switch (arr_format(v)) {
    case 'ascii':
      ret = Buffer.from(v).slice(0, maxchars).toString('ascii')
      if (v.length > maxchars) {
        ret += '..'
      }
      break
    case 'hex':
      // 1 byte = 2 chars.
      ret = 'x' + Buffer.from(v).slice(0, maxchars/2).toString('hex').toUpperCase()
      break
    default:
      ret = v   // not a byte array.  do not convert.
  }
  return ret
}

buf2str.stringify = function stringify (v, opt) {
  opt = opt || {}
  return JSON.stringify(v, function (k, v) {
    if (v && typeof v === 'object') {
      v = buf2str(v, opt.buf_maxchars || 8)
    }
    return v
  }, opt.spacer)
}

module.exports = buf2str
