// a suite of generally useful functions.

ASCII_MIN = 65;
ALPHABET_COUNT = 26;
BINARY_STRING_REGEX = /^[0|1]+$/;
TERNARY_STRING_REGEX = /^[0|1|2]+$/;
UNKNOWN_INPUT = "??";

MORSE_TO_PLAIN = {
  ".-": "A",  "-...": "B",  "-.-.": "C",  "-..": "D",  ".": "E",  "..-.": "F",
  "--.": "G",  "....": "H",  "..": "I",  ".---": "J",  "-.-": "K",  ".-..": "L",
  "--": "M",  "-.": "N",  "---": "O",  ".--.": "P",  "--.-": "Q",  ".-.": "R",
  "...": "S",  "-": "T",  "..-": "U",  "...-": "V",  ".--": "W",  "-..-": "X",
  "-.--": "Y",  "--..": "Z",  ".----": "1",  "..---": "2",  "...--": "3",
  "....-": "4",  ".....": "5",  "-....": "6",  "--...": "7",  "---..": "8",
  "----.": "9",  "-----": "0"
};

PLAIN_TO_MORSE = [];
for (key in MORSE_TO_PLAIN) {
  PLAIN_TO_MORSE[MORSE_TO_PLAIN[key]] = key;
}


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
 * Given a string of morse code, convert it to plain text.
 *
 * @param {String} the input text convert
 * @param {String} the optional string to use for a dot
 * @param {String} the optional string to use for a dash
 */
function FROM_MORSE(input, optDotChar, optDashChar) {
  return _forEachWord(input, function(word) {
    var normalizedString = new String(word);

    // convert word to dots and dashes
    if (optDotChar != undefined || optDotChar != null) {
      normalizedString = _gsub(normalizedString, optDotChar, '.');
    }
    
    if (optDashChar != undefined || optDashChar != null) {
      normalizedString = _gsub(normalizedString, optDashChar, '-');
    }
    
    return normalizedString in MORSE_TO_PLAIN ? MORSE_TO_PLAIN[normalizedString] : UNKNOWN_INPUT;
  }
  );
}

/**
 * Given an input string, return the Morse code equivalent.
 * @param {String} input string to convert
 * @return {String} the input encoded to Morse
 */
function TO_MORSE(input) {
  return _forEachWord(input, function(word) {
    return word in PLAIN_TO_MORSE ? PLAIN_TO_MORSE[word] : UNKNOWN_INPUT;
  });
}

/**
 * Given a string, return the morse code equivalent.
 *
 
 

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

/** 
 * Given a string, replace all instances of one string with another.
 * 
 * @param {String} unmodified string
 * @param {String} string to replace
 * @param {String} string to use as substitute
 */
function _gsub(inputString, replaceString, substituteString) {
  if (inputString == null || replaceString == null || substituteString == null) {
    return inputString;
  }
  
  return inputString.replace(new RegExp(_escapeRegExp(replaceString), 'g'), substituteString);
}

/**
 * Provides a simple way to to escape regexp meta characters.
 * Via: http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
 */
function _escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}