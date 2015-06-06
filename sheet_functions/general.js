// a suite of generally useful functions.

var ASCII_MIN = 65;
var ALPHABET_COUNT = 26;
var BINARY_STRING_REGEX = /^[0|1]+$/;
var TERNARY_STRING_REGEX = /^[0|1|2]+$/;

/** 
 * Gives the alphabetic character conforming to the given alphabet index.
 * For instance, INDEX_IN_ALPHABET(9) will return I.
 *
 * @param {Number} the number to use as an index into the alphabet
 * @return {String} the letter of the alphabet represented by that index. Blank if an invalid number.
 */
function INDEX_IN_ALPHABET(index) {
  if (index == null || index < 0 || index > ALPHABET_COUNT) {
    return null;
  }
  return String.fromCharCode((ASCII_MIN - 1) + index); // - 1 because the alphabet is 1-indexed, but ASCII is 0-indexed
}

/**
 * Converts a binary string into a decimal number.
 *
 * @param {String} binary sequence to convert
 * @return {Number} the decimal equivalent of the binary string
 */
function BINARY_TO_NUMBER(binaryString) {
  return _stringToDecimal(binaryString, 2, BINARY_STRING_REGEX);
}

/** 
 * Converts a ternary string into a decimal number.
 *
 * @param {String} ternary sequence to convert
 * @return {Number} the decimal equivalent of the ternary string.
 */
function TERNARY_TO_NUMBER(ternaryString) {
  return _stringToDecimal(ternaryString, 3, TERNARY_STRING_REGEX);
}

/** 
 * Internal method for converting a string to decimal given a base and a regex to use for validation.
 */
function _stringToDecimal(string, radix, validatingRegex) {
  if (string == null) {
    return null;
  }
  
  if (!(validatingRegex.test(string))) {
    return null;
  }
  
  return parseInt(string, radix); 
}
