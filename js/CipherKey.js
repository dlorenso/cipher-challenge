/**
 * Copyright (c) 2018 D. Dante Lorenso.  All Rights Reserved.
 * This source file is subject to the new BSD license that is bundled with this package in the
 * file LICENSE.txt.  It is also available through the world-wide web at this URL:
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * Cipher Key is an array of the letters of the alphabet represented as an integer array.  We map the letters A ... Z on to 0 ... 25 so that
 * our quadgram dictionary lookups and text decoding can be optimized for speed.  By using integer values, we also discard concerns for
 * character case sensitivity in our cipher key text.
 *
 * We allow the 'key' to be exposed as a public variable to avoid cost in wrapping the array lookups in setter/getter function calls.  Again,
 * we are *really* going for speed here.  As a rule, the 'key' is readable from outside this class, but it should not be written from outside
 * the class.  Only the swap() and shuffle() methods will be used to modify the order of the cipher key characters.
 */
var CipherKey = /** @class */ (function () {
    function CipherKey() {
        // this is our alphabet a-z represented as integers
        this.key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    }
    /**
     * Randomize the letters in our cipher key.
     */
    CipherKey.prototype.shuffle = function () {
        var i = this.key.length;
        // make sure we have elements to shuffle
        if (i === 0) {
            return this;
        }
        // iterate from back to front
        while (--i) {
            // select a random position to swap with
            var j = Math.floor(Math.random() * (i + 1));
            this.swap(i, j);
        }
    };
    /**
     * Convert the integer array key format into text characters we can print.
     * @returns {string}
     */
    CipherKey.prototype.toString = function () {
        var str = '';
        // loop through integers in the key
        for (var i = 0; i < this.key.length; i++) {
            // get the letter from a-z for the given integer value
            str += String.fromCharCode(this.key[i] + 97);
        }
        // the text representation of our key
        return str;
    };
    /**
     * @param {number} i
     * @param {number} j
     */
    CipherKey.prototype.swap = function (i, j) {
        // swap the values in these positions
        var temp = this.key[i];
        this.key[i] = this.key[j];
        this.key[j] = temp;
    };
    return CipherKey;
}());
//# sourceMappingURL=CipherKey.js.map