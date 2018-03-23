/**
 * Copyright (C) 2018 D. Dante Lorenso <dante@lorenso.com> - All Rights Reserved
 *
 * The worker process receives a 'start' message and will solve the cryptogram (mono-alphabetic substitution cipher) by finding a
 * best-fit cipher key.  The Cipher Solver will fire "events" during stages of the local search process to update the UI and provide
 * feedback about the solving status.
 */
//

// english quadgram dictionary
importScripts('Dictionary.js');
var dict = quad_english_dictionary;

// classes
importScripts('Timer.js');
importScripts('CipherKey.js');
importScripts('CipherText.js');
importScripts('CipherSolver.js');

/**
 * Handle start event for worker.
 */
addEventListener('message', function (e) {
	// received START message
	if (e.data.cmd === 'start') {
		// create our cipher text
		var ctext = new CipherText(e.data.cipher_text);

		// solver
		var solver = new CipherSolver();
		solver.setDictionary(dict);
		solver.solve(ctext);
	}
}, false);

