// a suite of generally useful functions.

ASCII_MIN = 65;
ALPHABET_COUNT = 26;
BINARY_STRING_REGEX = /^[0|1]+$/;
TERNARY_STRING_REGEX = /^[0|1|2]+$/;
UNKNOWN_INPUT = "??";

/** 
 * Gives the alphabetic character conforming to the given alphabet index.
 * For instance, INDEX_IN_ALPHABET(9) will return I.
 *
 * @param {Number} the number to use as an index into the alphabet
 * @return {String} the letter of the alphabet represented by that index. Blank if an invalid number.
 */
function INDEX_IN_ALPHABET(index) {
  return _forEachWord( index, 
                       function(word) { 
                         var parsedInt = parseInt(word);
                         return parsedInt < 1 || parsedInt > ALPHABET_COUNT ? UNKNOWN_INPUT :String.fromCharCode((ASCII_MIN - 1) + parsedInt); 
                       }
                     );
}

/**
 * Converts a binary string into a decimal number.
 *
 * @param {String} binary sequence to convert
 * @return {Number} the decimal equivalent of the binary string
 */
function BINARY_TO_NUMBER(binaryString) {
  return _forEachWord(binaryString, function(word) { return _stringToDecimalString(word, 2, BINARY_STRING_REGEX); } );
}

/** 
 * Converts a ternary string into a decimal number.
 *
 * @param {String} ternary sequence to convert
 * @return {Number} the decimal equivalent of the ternary string.
 */
function TERNARY_TO_NUMBER(ternaryString) {
  return _forEachWord(ternaryString, function(word) { return _stringToDecimalString(word, 3, TERNARY_STRING_REGEX); } );
}

/** 
 * Internal method for converting a string to decimal given a base and a regex to use for validation.
 */
function _stringToDecimalString(input, radix, validatingRegex) {
  if (!(validatingRegex.test(input))) {
    return null;
  }
  return parseInt(input, radix).toString(); 
}

/**
 * Calls the passed function once for each word (space-delimited) in the input.
 *
 * @param {String} the input to be parsed
 * @param {Function} a callback function to be executed for each word in the input. The callback function will take a single String as its input.
 * @return {String} the concatenated results of each call to callback for each word.
 */
function _forEachWord(input, callback) {
  if (input == null || input == undefined) {
    return null;
  }
  var words = input.toString().split(" ");
  return words.map( function(word) { return callback(word); } ).join(" ");
}
