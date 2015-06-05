/** Tests at https://docs.google.com/spreadsheets/d/1WAYFVWmO9o5UXqDmf8i20E-936ubKsXBM-S3XOXdX8s/edit#gid=0 */

// min and max values for uppercase letters
var ASCII_CAP_MIN = 65;
var ASCII_CAP_MAX = 90;

// min and max values for lowercase letters
var ASCII_LOW_MIN = 97;
var ASCII_LOW_MAX = 122;

/**
 * A function that does a Caesar shift on a string, advancing each character a given amount through the alphabet.
 *
 * @param {String} the string to shift
 * @param {Number} the amount to shift by
 * @return the shifted string
 */
function CAESAR_SHIFT(initialString, shiftAmount) {
  if (initialString == null) {
    return null;
  }
  
  var chars = initialString.split("");
  var newChars = chars.map(function(currentValue, _index, _array) {
    var asciiValue = currentValue.charCodeAt(0);
    if (asciiValue >= ASCII_CAP_MIN && asciiValue <= ASCII_CAP_MAX) {
      return String.fromCharCode(_findModOffsetInRange(asciiValue, shiftAmount, ASCII_CAP_MIN, ASCII_CAP_MAX));
    } else if (asciiValue >= ASCII_LOW_MIN && asciiValue <= ASCII_LOW_MAX) {
      return String.fromCharCode(_findModOffsetInRange(asciiValue, shiftAmount, ASCII_LOW_MIN, ASCII_LOW_MAX));
    } else {
      return currentValue;
    }
  });

  return newChars.join("");  
}

/**
 * Internal function for shifting a value within a range 
 */
function _findModOffsetInRange(value, shiftAmount, rangeMin, rangeMax) {
  return (((value - rangeMin) + shiftAmount) % (rangeMax - rangeMin + 1)) + rangeMin
}