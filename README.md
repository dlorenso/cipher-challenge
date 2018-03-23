# cipher-challenge

Cipher Challenge - Prepared for a company near Dallas, TX - by D. Dante Lorenso

## Original Challenge Instructions

Cipher Challenge

> During World War II, Alan Turing (who is considered the father of modern computing) used computational analysis, and created
the first computer to decrypt German messages. Given a key, the computer could decrypt messages at an alarming pace.

You are provided a set of plain text files: *`encrypted.txt`*, *`encrypted_hard.txt`*, and *`plain.txt`*.

You are to provide a project that decrypts `encrypted.txt`, using `plain.txt` as a base. The `plain.txt` file
contains the literary works of William Shakespeare. There are various language patterns to create a 
computational algorithm for various types of analysis.

#### Please note the following:

- You can use a 1 for 1 type of algorithm. Which means, an uppercase character is the same as a lowercase character.
- Punctuation is punctuation, there is no decryption needed on these characters.
- Spaces are spaces, there is no decryption needed on these either.
- You may use any language you are comfortable with.
- There are no extra symbols used for the cipher.
- You may keep or remove the Project Gutenberg text in plain.txt . It has very little impact on the result.

#### Please provide the following in your project:

1. The decrypted output of encrypted.txt in a plain text file.
2. A project that contains the code you used to encrypt the file (how you structure your project will have an impact on the challenge as well).
3. Note: A brute force solution will not suffice. Take into account that, like the Germans in WWII, we would modify the key at a moment's notice.
4. Please provide a solution that shows how you derived your cipher key.

#### Impress us with:

1. A decrypted output of encrypted_hard.txt .
2. A well documented project that provides various best practices.
3. A well structured API that can be used to decrypt files using a similar algorithm.
4. A well structured front-end experience.

Please note: that the above are not requirements, but will help us determine your level of experience with the language(s) and tooling you provided.

## The Solution

1. The original data files are located in the 'data' directory.
   * `data/encrypted.txt`
   * `data/encrypted_hard.txt`

2. A copy of the decrypted versions of these files are located in the 'output' directory and are named as follows:
	- `output/encrypted-decoded.txt`
	- `output/encrypted_hard-decoded.txt`

3. This project was written using the VueJS, Axios, Bootstrap 4, and Font Awesome 5.  All of these libraries and 
stylesheets have been referenced using external CDN urls.  You will need to have an internet connection in order
to test this code.

4. The cipher key is found using a hill-climbing algorithm (local search) to find a cipher key such that the decoded text achieves the
best "fitness" score as english text.  The fitness score is calculated using quadgram frequency analysis scores from a corpus of
the english language.  This JavaScript/TypeScript solution implements this algorithm to derive the cipher key through local search
and will display the best match to the browser.

	Having run this already against the `encrypted.txt` and `encrypted_hard.txt` files, I have determined the best cipher keys to be
the following:

   - `encrypted.txt` = zyxwfvubctsrdeqponmlkjihga
   - `encrypted_hard.txt` = takszywlqjbrmvgocduinpfxhe

   By running the code on your end, you should find similar results.

## How To Run

To run this project, the files must be served from a web server.  This requirement exists because
the project uses javascript Web Workers and also loads text files and JavaScript code using URL
paths.

If you do not have an available web server, the easiest way to run this code is by starting up a
light-weight python web server as follows:

	> cd cipher-challenge
	> python -m http.server

Then, simply navigate to the HTTP server at the following url:

	http://localhost:8000/solver.html
