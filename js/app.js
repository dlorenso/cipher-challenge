/**
 * Copyright (C) 2018 D. Dante Lorenso <dante@lorenso.com> - All Rights Reserved
 *
 * The app logic is just some glue for the UI that is based on crude VueJS.
 */

var worker = new Worker('js/worker.js');
worker.addEventListener('message', worker_response, false);

/**
 * These are the messages received from the worker process to notify the UI about progress.
 *
 * @param e
 */
function worker_response(e) {
	var data = e.data;

	switch (data.resp) {
		case 'update' :
			// status
			app.runtime = data.runtime;

			// statistics
			app.showStats = true;
			app.number_keys = data.nbr_keys;
			app.rate = data.rate;
			app.rounds = data.rounds;
			break;

		case 'done' :
			// status
			app.runtime = data.runtime;
			app.status = 'Done';

			// statistics
			app.showStats = true;
			app.number_keys = data.nbr_keys;
			app.rate = data.rate.toFixed(0);
			app.rounds = data.rounds;

			// buttons
			app.btnMode = 'decode';
			break;

		case 'key' :
			// status
			app.runtime = data.runtime;

			// statistics
			app.showStats = true;
			app.cipher_length = data.len;
			app.key_score = data.score.toFixed(2);
			app.number_keys = data.nbr_keys;
			app.rate = data.rate.toFixed(0);
			app.rounds = data.rounds;

			// result
			app.cipher_key = data.key;
			app.plain_text = data.plain;
			break;
	}
}

var app = new Vue({
	el: '#app',
	data: {
		// form
		btnMode: 'decode',
		cipher_text: '',
		plain_text: '',

		// status
		runtime: 0,
		status: 'Ready to Decode',

		// statistics
		showStats: false,
		cipher_length: 0,
		key_score: 0,
		number_keys: 0,
		rate: 0,
		rounds: 0,

		// result
		cipher_key: ''
	},
	methods: {
		decodeStart: function () {
			// status
			this.runtime = '0';
			this.status = 'Calculating...';

			// buttons
			this.btnMode = 'stop';

			// result
			this.cipher_key = '';
			this.plain_text = '';

			// start decode process
			worker.postMessage({
				'cipher_text': document.getElementById("cipher").value,
				'cmd': 'start'
			});
		},
		decodeStop: function () {
			// kill the current worker
			worker.terminate();

			// create a new worker and bind it
			worker = new Worker('js/worker.js');
			worker.addEventListener('message', worker_response, false);

			// buttons
			this.btnMode = 'decode';

			// status
			this.status = 'Aborted';
		},
		loadFile: function (file_path) {
			// load encrypted.txt file
			axios.get(file_path).then(function (response) {
				app.cipher_text = response.data;
			});
		},
		resetForm: function () {
			// form
			this.btnMode = 'decode';
			this.cipher_text = '';
			this.plain_text = '';

			// result
			this.cipher_key = '';

			// status
			this.runtime = 0;
			this.status = 'Ready to Decode';

			// statistics
			this.showStats = false;
		}
	}
});
