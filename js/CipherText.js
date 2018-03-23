/**
 * Copyright (C) 2018 D. Dante Lorenso <dante@lorenso.com> - All Rights Reserved
 *
 * Cipher Text will parse the original cipher text into a 'cipher' array that maps a-z and A-Z characters onto 0 .. 25 integer values
 * and tracks the original text case and non-alpha characters in the 'control' array.
 *
 * We expose the 'cipher' array as public to help SPEED the text quadgram lookups.
 */
var CipherText = /** @class */ (function () {
    /**
     * @param {string} cipher_text
     */
    function CipherText(cipher_text) {
        /** just the cipher characters from the text */
        this.cipher = [];
        /** control characters */
        this.control = [];
        /** original cipher text */
        this.text = '';
        this.setText(cipher_text);
    }
    /**
     * Parse the input text and extract an integer value for each character in the range a-z or A-Z (ignore case).  Skip all non-letters, but
     * track all characters and mark the "control" array with the case of the letter or that the character is skipped (keep original):
     * 0 = uppercase
     * 1 = lowercase
     * 2 = non-letter
     * The letters we keep are tracked in the "cipher" array as numbers.
     * @param {string} cipher_text
     */
    CipherText.prototype.setText = function (cipher_text) {
        // save original cipher text
        this.text = cipher_text;
        // reset these values
        this.cipher = [];
        this.control = [];
        // process all characters in the text
        for (var i = 0; i < cipher_text.length; i++) {
            // read the character in our string
            var ch = cipher_text.charCodeAt(i);
            // uppercase character
            if (ch >= 65 && ch <= 90) {
                this.control[i] = 0; // remember this was uppercase
                this.cipher.push(ch - 65); // add the character
            }
            else if (ch >= 97 && ch <= 122) {
                this.control[i] = 1; // remember this was lowercase
                this.cipher.push(ch - 97); // add the character
            }
            else {
                this.control[i] = 2; // remember this was whitespace (preserved)
            }
        }
    };
    /**
     * Decode the original text using the provided cipher key.
     * @returns {string}
     */
    CipherText.prototype.decodeText = function (key) {
        var str = "";
        var plain_idx = 0;
        // loop through all the characters in our input text
        for (var i = 0; i < this.control.length; i++) {
            // uppercase letter (use our key to map this letter)
            if (this.control[i] === 0) {
                str += String.fromCharCode(key.key[this.cipher[plain_idx++]] + 65);
            }
            else if (this.control[i] === 1) {
                str += String.fromCharCode(key.key[this.cipher[plain_idx++]] + 97);
            }
            else {
                str += this.text.substr(i, 1);
            }
        }
        // the translated text
        return str;
    };
    return CipherText;
}());
//# sourceMappingURL=CipherText.js.map