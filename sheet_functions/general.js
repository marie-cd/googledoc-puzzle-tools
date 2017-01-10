// a suite of generally useful functions.

ASCII_MIN = 65;
ALPHABET_COUNT = 26;
BINARY_STRING_REGEX = /^[0|1]+$/;
TERNARY_STRING_REGEX = /^[0|1|2]+$/;
UNKNOWN_INPUT = "??";

NUTRIMATIC_SEARCH = "nutrimatic";
WORDSMITH_SEARCH = "wordsmith";

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
 * Fetches results from the given source.
 */
function fetchResultsForSidePane(source, queryText, maxResults) {
  if (source == NUTRIMATIC_SEARCH) {
    return fetchResultsFromNutrimatic(queryText, maxResults);
  }
  return fetchResultsFromWordsmith(queryText, maxResults);
}


/**
 * Uses wordsmith.org Anagram Solver to return an array of anagrams.
 * @param {string} input the text to anagram
 * @param {number=} maxResults the maximum number of results (optional, default=10)
 * @return {string[]} of results
 *
 * @customfunction
 */
function ANAGRAM(input, maxResults) {
  return [fetchResultsFromWordsmith(input, maxResults)];
}


/**
 * Gets anagrams from wordsmith.org/anagram.
 */
function fetchResultsFromWordsmith(queryText, maxResults) {
  if (maxResults == undefined) {
    maxResults = 10;
  }
  var result_re = /^(<\/b><br>)?[ A-Za-z]+<br>$/;
  var response = UrlFetchApp.fetch("http://wordsmith.org/anagram/anagram.cgi?anagram="+queryText+"&t="+maxResults);
  var lines = response.getContentText().split("\n");
  var results = [];
  for (line in lines) {
    var curLine = lines[line];
    if (result_re.test(curLine)) {
      curLine = curLine.replace(/<br>|<\/b>/g,"");
      results.push(curLine.trim());
    }
  }
  return results;
}


/**
 * Uses nutrimatic.org to return an array of results.
 * @param {string} input the query text
 * @param {number=} maxResults the maximum number of results (optional, default=10)
 * @return {string[]} of results
 *
 * @customfunction
 */
function NUTRIMATIC(input, maxResults) {
  return [fetchResultsFromNutrimatic(input, maxResults)];
}


/**
 * Gets anagrams from wordsmith.org/anagram.
 */
function fetchResultsFromNutrimatic(queryText, maxResults) {
  if (maxResults == undefined) {
    maxResults = 10;
  }
  var result_re = />([ a-z]+)<\/span><br>$/;
  var uriSafeQueryText = encodeURIComponent(queryText)
  var response = UrlFetchApp.fetch("https://nutrimatic.org/?src=googledoc-puzzle-tools&q="+uriSafeQueryText);
  var lines = response.getContentText().split("\n");
  var results = [];
  for (line in lines) {
    var curLine = lines[line];
    var match = result_re.exec(curLine);
    if (match != null) {
      results.push(match[1]);
      if (results.length >= maxResults) break;
    }
  }
  return results;
}

/**
 * Given an input string, split each character into its own cell.
 *
 * @param {string} input text to split up
 * @param {string=} delimiter character to split on (default="")
 * @return {string[]} the individual characters of the input text.
 *
 * @customfunction
 */
function SPLIT_INTO_CELLS(input, delimiter) {
  if (input == null) {
    return null;
  }

  var chars = input.toString().split(delimiter == undefined || delimiter == null ? "" : delimiter);
  return [chars];
}

/**
 * Gives the alphabetic character conforming to the given alphabet index.
 * For instance, INDEX_IN_ALPHABET(9) will return I.
 *
 * @param {number} index the number to use as an index into the alphabet
 * @return {string} the letter of the alphabet represented by that index. Blank if an invalid number.
 *
 * @customfunction
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
 * Gives the nth character from a string.
 *
 * In some ways, this is a shorthand for the MID(n,1) command, but
 * this documents its purpose better and uses our per-word
 * mechanism, so that INDEX_IN_STRING(string, "11 5") will return
 * the 11th letter and the fifth one.
 *
 * @param {string} string the string to index into
 * @param {string} index the 1-indexed index or indices to use for parsing the string.
 *
 * @customfunction
 */
function INDEX_IN_STRING(string, index) {
  if (string == null) {return null;}

  // note that substring is 0 based, while the user will be using human numbers
  return _forEachWord(index, function(word) {
      var curIndex = parseInt(word);
      return string.substring(curIndex - 1, curIndex);});
}

/**
 * Uppercases a string and removes anything non-alphanumeric (except underscores).
 *
 * @param {string} input string to answerize
 * @param {boolean=} spacesOnly only remove whitespace, keeping all other visible characters (optional, default=FALSE)
 * @return {string} input answerized string in all caps
 * @customfunction
 */
function ANSWERIZE(input, spacesOnly) {
  if (input == null) {
    return null;
  }
  if (spacesOnly) {
    return input.toUpperCase().replace(/[\s]/g,"");
  }
  return input.toUpperCase().replace(/[^A-Z0-9_]/g,"");
}

/**
 * Converts a binary string into a decimal number.
 *
 * @param {string} binaryString binary sequence to convert
 * @return {number} the decimal equivalent of the binary string
 * @customfunction
 */
function BINARY_TO_NUMBER(binaryString) {
  return _forEachWord(binaryString, function(word) { return _stringToDecimalString(word, 2, BINARY_STRING_REGEX); } );
}

/**
 * Converts a ternary string into a decimal number.
 *
 * @param {string} ternaryString ternary sequence to convert
 * @return {number} the decimal equivalent of the ternary string.
 *
 * @customfunction
 */
function TERNARY_TO_NUMBER(ternaryString) {
  return _forEachWord(ternaryString, function(word) { return _stringToDecimalString(word, 3, TERNARY_STRING_REGEX); } );
}

/**
 * Given a string of morse code, convert it to plain text.
 *
 * @param {string} input the input text to convert
 * @param {string=} dotChar the symbol to use for a dot (optional, default=".")
 * @param {string=} dashChar the symbol to use for a dash (optional, default="-")
 * @return {string} the decoded string
 *
 * @customfunction
 */
function FROM_MORSE(input, dotChar, dashChar) {
  return _forEachWord(input, function(word) {
    var normalizedString = new String(word);

    // convert word to dots and dashes
    if (dotChar != undefined || dotChar != null) {
      normalizedString = _gsub(normalizedString, dotChar, '.');
    }

    if (dashChar != undefined || dashChar != null) {
      normalizedString = _gsub(normalizedString, dashChar, '-');
    }
    return normalizedString in MORSE_TO_PLAIN ? MORSE_TO_PLAIN[normalizedString] : UNKNOWN_INPUT;
  }
  );
}

/**
 * Given an input string, return the Morse code equivalent.
 * @param {string} input input string to convert
 * @param {string=} delimiter the string used as a delimiter in the concatenated result string (optional, default=" ")
 * @return {string} the input encoded to Morse
 *
 * @customfunction
 */
function TO_MORSE(input, delimiter) {
  if (_isNullOrUndefined(input)) { return null; }
  if (_isNullOrUndefined(delimiter)) { delimiter = " "; }
  return _forEachCharacterInEachWord(input.toUpperCase(), function(character) {
    return character in PLAIN_TO_MORSE ? PLAIN_TO_MORSE[character] : UNKNOWN_INPUT;
  }, delimiter);
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
 * @param {string} input the input to be parsed
 * @param {function} callback a callback function to be executed for each word in the input. The callback function will take a single String as its input.
 * @return {string} the concatenated results of each call to callback for each word.
 */
function _forEachWord(input, callback) {
  if (_isNullOrUndefined(input)) {return null;}
  var words = input.toString().split(" ");
  return words.map( function(word) { return callback(word); } ).join(" ");
}

/**
 * Calls the passed function once for each letter in the input string.
 * @param {string} input the input to process
 * @param {function} callback a callback function that will be executed for each character in the input. The callback function gets a single letter as an argument and should return a transformed value.
 * @param {string=} delimiter the string used as a delimiter in the concatenated result string (optional, default="")
 * @return {string} the transformed characters concatenated back into a string.
 */
function _forEachCharacter(input, callback, delimiter) {
  if (_isNullOrUndefined(input)) { return null; }
  if (_isNullOrUndefined(delimiter)) { delimiter = ""; }
  var chars = input.split("");
  return chars.map(function(character) {return callback(character);}).join(delimiter);
}

/**
 * Calls the passed function once for each character in each word. In other words, spaces between words will not be passed to the function.
 * @param {string} input the input string to process
 * @param {function} callback the callback function to use for each character in each word.
 * @param {string=} delimiter the string used as a delimiter in the concatenated result string (optional, default="")
 * @return {string} the transformed string.
 */
function _forEachCharacterInEachWord(input, callback, delimiter) {
  return _forEachWord(input, function(word) {
    return _forEachCharacter(word, function(character) { return callback(character);}, delimiter);
  });
}


/**
 * Checks whether the value is null or undefined
 * @param {Object} value a value to check
 * @return {boolean} true if the object is null or undefined, false if not.
 */
function _isNullOrUndefined(value) {
  return value == null || value == undefined;
}


/**
 * Given a string, replace all instances of one string with another.
 *
 * @param {string} inputString unmodified string
 * @param {string} replaceString string to replace
 * @param {string} substituteString string to use as substitute
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
