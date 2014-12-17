var startData = {
  entities : [
    { name: "Tom", type: "person", age: "28", image: "http://img3.wikia.nocookie.net/__cb20120329233907/alcatraztv/images/2/22/2002_mugshot.jpg"},
    { name: "Bob", type: "person", image: "http://images.amcnetworks.com/blogs.amctv.com/wp-content/uploads/2010/04/Krazy-8-Mugshot-760.jpg"},
    { name: "Tom\'s house", type: "place", location: "1234 1st St"},
    { name: "Tom\'s motorcycle", type: "thing", brand: "Honda"}
    ], 
  edges : [
    { source: '6ccf636aa68475c9711fe80cc6595339ab5b093c', target: '0093a56270a68bcfc2acfe8b253c81b646a2c3f2', rel: "lives at"},
    { source: '0093a56270a68bcfc2acfe8b253c81b646a2c3f2', target: '6ccf636aa68475c9711fe80cc6595339ab5b093c', rel: "residence of"},
    { source: '23a8f91a975089e7ccd2229674a6dcad51fbd42f', target: '0093a56270a68bcfc2acfe8b253c81b646a2c3f2', rel: "painted"},
    { source: '6ccf636aa68475c9711fe80cc6595339ab5b093c', target: '23a8f91a975089e7ccd2229674a6dcad51fbd42f', rel: 'knows'}  
]};

//test construtor 
var testDB = new Graph.Database({cache: 'testData', datasource: startData, indexGenerator: function(obj){
    var str = JSON.stringify(obj);
    /** Extend String object with method to encode multi-byte string to utf8
    * - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
    var utf8Encode = function(str) {
      return unescape( encodeURIComponent( str ) );
    };
    /** Extend String object with method to decode utf8 string to multi-byte */
    var utf8Decode = function(str) {
      try {
        return decodeURIComponent( escape( str ) );
      } catch (e) {
        return str; // invalid UTF-8? return as-is
      }
    };
    
    /**
    * Function 'f' [§4.1.1].
    * @private
    */
    var _f = function(s, x, y, z) {
      switch (s) {
      case 0: return (x & y) ^ (~x & z); // Ch()
      case 1: return x ^ y ^ z; // Parity()
      case 2: return (x & y) ^ (x & z) ^ (y & z); // Maj()
      case 3: return x ^ y ^ z; // Parity()
      }
    };
    /**
    * Rotates left (circular left shift) value x by n positions [§3.2.5].
    * @private
    */
    var _ROTL = function(x, n) {
      return (x<<n) | (x>>>(32-n));
    };
    /**
    * Hexadecimal representation of a number.
    * @private
    */
    var _toHexStr = function(n) {
      // note can't use toString(16) as it is implementation-dependant,
      // and in IE returns signed numbers when used on full words
      var s="", v;
      for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
      return s;
    };
    
    var msg = str.toString();
    // convert string to UTF-8, as SHA only deals with byte-streams
    msg = utf8Encode(msg);
    // constants [§4.2.1]
    var K = [ 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6 ];
    // PREPROCESSING
    msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [§5.1.1]
    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l/16); // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);
    for (var i=0; i<N; i++) {
      M[i] = new Array(16);
        for (var j=0; j<16; j++) { // encode 4 chars per integer, big-endian encoding
          M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
          (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
      }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;
    // set initial hash value [§5.3.1]
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;
    // HASH COMPUTATION [§6.1.2]
    var W = new Array(80); var a, b, c, d, e;
    for (var i=0; i<N; i++) {
    // 1 - prepare message schedule 'W'
    for (var t=0; t<16; t++) W[t] = M[i][t];
    for (t=16; t<80; t++) W[t] = _ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);
    // 2 - initialise five working variables a, b, c, d, e with previous hash value
    a = H0; b = H1; c = H2; d = H3; e = H4;
    // 3 - main loop
    for (t=0; t<80; t++) {
      var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
      var T = (_ROTL(a,5) + _f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
      e = d;
      d = c;
      c = _ROTL(b, 30);
      b = a;
      a = T;
      }
      // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
      H0 = (H0+a) & 0xffffffff;
      H1 = (H1+b) & 0xffffffff;
      H2 = (H2+c) & 0xffffffff;
      H3 = (H3+d) & 0xffffffff;
      H4 = (H4+e) & 0xffffffff;
    }
    return _toHexStr(H0) + _toHexStr(H1) + _toHexStr(H2) +
    _toHexStr(H3) + _toHexStr(H4);
  }
}); 
var dashboard = new Graph.Dashboard({database: testDB, container: $('#main'), layout: {
  rows: [{
    class: 'row',
    cols: [{
      class: 'col-md-12 col-s-12',
      component: d3_tree
    }]
  },{
    class: 'row',
    cols: [{
      class: 'col-md-8 col-s-12',
      component: person_template
    },{
      class: 'col-md-4 col-s-12',
      component: friendslist
    }]
  }]
}});
dashboard.bind(testDB.query().filter({name: 'Tom' }).first());
dashboard.addLayout('place', {type: 'place'}, {
  rows: [{
    class: 'row',
    cols: [{
      class: 'col-md-12 col-s-12',
      component: d3_tree
    }]
  },{
    class: 'row',
    cols: [{
      class: 'col-md-8 col-s-12',
      component: Graph.Component.extend({})
    }]
  }]
});
