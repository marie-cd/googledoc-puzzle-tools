// min and max values for uppercase letters
var ASCII_CAP_MIN = 65;
var ASCII_CAP_MAX = 90;

// min and max values for lowercase letters
var ASCII_LOW_MIN = 97;
var ASCII_LOW_MAX = 122;

/**
 * A function that does a Caesar shift on a string, advancing each character a given amount through the alphabet.
 *
 * @param {string} initialString the string to shift
 * @param {number} shiftAmount the amount to shift by
 * @return the shifted string
 * @customfunction
 */
function CAESAR_SHIFT(initialString, shiftAmount) {
  if (initialString == null) {
    return null;
  }
  return _forEachCharacterInEachWord(initialString, function(currentValue) {
    var asciiValue = currentValue.charCodeAt(0);
    if (_isInRange(asciiValue, ASCII_CAP_MIN, ASCII_CAP_MAX)) {
      return String.fromCharCode(_findModOffsetInRange(asciiValue, shiftAmount, ASCII_CAP_MIN, ASCII_CAP_MAX));
    } else if (_isInRange(asciiValue, ASCII_LOW_MIN, ASCII_LOW_MAX)) {
      return String.fromCharCode(_findModOffsetInRange(asciiValue, shiftAmount, ASCII_LOW_MIN, ASCII_LOW_MAX));
    } else {
      return currentValue;
    }
  });
}

/**
 * Internal function for shifting a value within a range
 */
function _findModOffsetInRange(value, shiftAmount, rangeMin, rangeMax) {
  var rangeSize = rangeMax - rangeMin + 1; // to handle inclusivity
  var normalizedShift = shiftAmount >= 0 ? shiftAmount : rangeSize + shiftAmount;
  return (((value - rangeMin) + normalizedShift) % rangeSize) + rangeMin;
}

/**
 * Internal function to determine if a given number is within a range, inclusively.
 */
function _isInRange(value, min, max) {
  return value >= min && value <= max;
}
