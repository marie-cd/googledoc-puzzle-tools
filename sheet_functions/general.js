// a suite of generally useful functions.

var ASCII_MIN = 65;
var ALPHABET_COUNT = 26;

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
