/**
 * Copyright (c) 2018 D. Dante Lorenso <dante@lorenso.com>.  All Rights Reserved.
 * This source file is subject to the MIT license that is bundled with this package
 * in the file LICENSE.txt.  It is also available at: https://opensource.org/licenses/MIT
 *
 * Dante's Cipher Solver is based on work by several online references including the following:
 *
 * http://practicalcryptography.com/cryptanalysis/text-characterisation/quadgrams/
 * https://april.eecs.umich.edu/papers/details.php?name=olson2007crypt
 * https://www.guballa.de/substitution-solver
 * https://en.wikipedia.org/wiki/Substitution_cipher
 * https://en.wikipedia.org/wiki/Hill_climbing
 * https://repository.cardiffmet.ac.uk/bitstream/handle/10369/8628/Brown%2C%20Ryan%20James.pdf
 *
 * In numerical analysis, hill climbing is a mathematical optimization technique which belongs to the
 * family of local search. It is an iterative algorithm that starts with an arbitrary solution to a
 * problem, then attempts to find a better solution by incrementally changing a single element of
 * the solution. If the change produces a better solution, an incremental change is made to the new
 * solution, repeating until no further improvements can be found. ...
 *
 * We implement Hill Climbing to find the best Cipher Key that will decode the Cipher Text such that
 * the decoded text will yield the "best" fitness score.
 *
 * Hill climbing achieves optimal solutions in convex problems – otherwise it will find only local
 * optima (solutions that cannot be improved by considering a neighbouring configuration), which are
 * not necessarily the best possible solution (the global optimum) out of all possible solutions (the
 * search space). Examples of algorithms that solve convex problems by hill-climbing include the
 * simplex algorithm for linear programming and binary search.[1]:253 To attempt overcoming being
 * stuck in local optima, one could use restarts (i.e. repeated local search), or more complex
 * schemes based on iterations (like iterated local search), or on memory (like reactive search
 * optimization and tabu search), or on memory-less stochastic modifications (like simulated annealing).
 */
var CipherSolver = /** @class */ (function () {
    function CipherSolver() {
        // results
        this.best_score = 0;
        // stats
        this.number_keys_tried = 0;
        this.number_rounds = 0;
        this.timer = new Timer();
    }
    /**
     * https://en.wikipedia.org/wiki/Hill_climbing
     * @returns {number}
     */
    CipherSolver.prototype.hillClimbing = function (ctext) {
        var score = 0;
        var better_key;
        do {
            better_key = false;
            // iterate over each letter in the alphabet (a-z) as integers
            for (var i = 0; i < 25; i++) {
                for (var j = i + 1; j < 26; j++) {
                    // swap the characters in these positions
                    this.key.swap(i, j);
                    // count the number of keys processed
                    this.number_keys_tried++;
                    // compute the score of this key against the quadgrams dictionary
                    var new_score = 0;
                    // decode the first 3 characters
                    var idx = (this.key.key[ctext.cipher[0]] << 10) + (this.key.key[ctext.cipher[1]] << 5) + this.key.key[ctext.cipher[2]];
                    /**
                     * Now shift three characters to the left and decode another character (now we have a quadgram)
                     * The index into our hash is our decoded quadgram as a 20 bit value [ch=5 bits][ch=5 bits][ch=5 bits][ch=5 bits]
                     * where each of the 5 bits represents a number from 0 to 25 and therefore will map onto a letter from a to z.
                     * For example, here are the indexes of several example quadgrams:
                     *
                     * AAAA =  0  0  0  0 = 00000 00000 00000 00000 = 0000 0000 0000 0000 0000, 0000 0000 0000 0000 = 0
                     * PVBD = 15 21  2  4 = 01111 10101 00010 00100 = 0000 0000 0000 0000 0111, 1101 0100 0100 0100 = 513092
                     * ZZZZ = 25 25 25 25 = 11001 11001 11001 11001 = 0000 0000 0000 0000 1100, 1110 0111 0011 1001 = 845625
                     */
                    var len = ctext.cipher.length;
                    for (var x = 3; x < len; x++) {
                        idx = ((idx & 32767) << 5) + this.key.key[ctext.cipher[x]];
                        new_score += this.dict.charCodeAt(idx);
                    }
                    // this is a BETTER score, so it must be a better key
                    if (new_score > score) {
                        score = new_score;
                        better_key = true;
                        // this is the BEST score so far
                        this.eventKey(score, ctext);
                    }
                    else {
                        this.key.swap(i, j);
                    }
                }
            }
        } while (better_key);
        // the score for this run
        return score;
    };
    /**
     * @param {CipherText} ctext
     */
    CipherSolver.prototype.solve = function (ctext) {
        this.number_keys_tried = 0;
        this.best_score = 0;
        this.number_rounds = 0;
        // start our timer
        this.timer = new Timer();
        // never search more than 100,000 random keys
        var cntr = 100000;
        var nbr_best_scores = 0;
        while (cntr--) {
            this.number_rounds++;
            // create a new random cipher key
            this.key = new CipherKey();
            this.key.shuffle();
            // hill climb with this random cipher key
            var score = this.hillClimbing(ctext);
            // we found a new best score!
            if (score > this.best_score) {
                this.best_score = score;
                nbr_best_scores = 1;
            }
            else if (score === this.best_score) {
                // stop if we found this same key 3 times
                if (++nbr_best_scores === 3) {
                    break;
                }
            }
            // update status
            this.tick();
        }
        // cipher complete!
        this.eventDone();
    };
    /**
     * Save dictionary lookup hash.
     * @param {string} dict
     */
    CipherSolver.prototype.setDictionary = function (dict) {
        this.dict = dict;
    };
    /**
     */
    CipherSolver.prototype.tick = function () {
        if (this.timer.getTicktime() > 1) {
            this.timer.markTicktime();
            this.eventUpdate();
        }
    };
    /**
     * @param {number} score
     * @param {CipherText} ctext
     */
    CipherSolver.prototype.eventKey = function (score, ctext) {
        if (score > this.best_score) {
            var seconds = this.timer.getRuntime();
            // fire the event
            postMessage({
                // message response type
                'resp': 'key',
                // message data
                'key': this.key.toString(),
                'len': ctext.cipher.length,
                'nbr_keys': this.number_keys_tried,
                'plain': ctext.decodeText(this.key),
                'rate': this.number_keys_tried / seconds,
                'rounds': this.number_rounds,
                'runtime': seconds,
                'score': score / (ctext.cipher.length - 3) - 35
            });
        }
    };
    /**
     */
    CipherSolver.prototype.eventUpdate = function () {
        var seconds = this.timer.getRuntime();
        // fire event
        postMessage({
            // message response type
            'resp': 'update',
            // message data
            'nbr_keys': this.number_keys_tried,
            'rate': this.number_keys_tried / seconds,
            'rounds': this.number_rounds,
            'runtime': seconds
        });
    };
    /**
     *
     */
    CipherSolver.prototype.eventDone = function () {
        var seconds = this.timer.getRuntime();
        // fire event
        postMessage({
            // message response type
            'resp': 'done',
            // message data
            'nbr_keys': this.number_keys_tried,
            'rate': this.number_keys_tried / seconds,
            'rounds': this.number_rounds,
            'runtime': seconds
        });
    };
    return CipherSolver;
}());
//# sourceMappingURL=CipherSolver.js.map