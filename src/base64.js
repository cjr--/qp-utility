/* Copyright (c) 2011, Daniel Guerrero */
/* https://github.com/danguer/blog-examples/blob/master/js/base64-binary.js */

var BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function base64_decode(data_uri) {
  var data = rtrim(data_uri.slice(data_uri.indexOf(';base64,') + 8), '=');
  var bytes = parseInt((data.length / 4) * 3, 10);
  var uarray = new Uint8Array(bytes);
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  data = data.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  for (var i = 0, j = 0; i < bytes; i += 3) {	
    // get the 3 octects in 4 ascii chars
    enc1 = BASE64_KEYS.indexOf(data.charAt(j++));
    enc2 = BASE64_KEYS.indexOf(data.charAt(j++));
    enc3 = BASE64_KEYS.indexOf(data.charAt(j++));
    enc4 = BASE64_KEYS.indexOf(data.charAt(j++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    uarray[i] = chr1;			
    if (enc3 != 64) uarray[i + 1] = chr2;
    if (enc4 != 64) uarray[i + 2] = chr3;
  }
  return uarray;	
}
