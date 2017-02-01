# googledoc-puzzle-tools
Tools for easier group solving of Shinteki/Puzzle Hunt-type puzzles via Googledocs.

***This is now available as a [Google Sheets Add-On](https://chrome.google.com/webstore/detail/puzzle-tools/odpkaajlinkcdiipcenajekpphefofja)!***

# Useful existing functions
(REFS [Google's docs](https://support.google.com/docs/table/25273?hl=en))

| What the Function Does | Syntax |
| -----------------------|--------|
| Pull the [right/left] most N characters of a cell, including spaces | =RIGHT(CELL,N) / =LEFT(CELL,N) |
| Pull the middle N characters of a cell, starting with letter M | =MID(CELL, M, N) |
| Find the first instance of string STR in cell | =FIND("STR",CELL) |
| Remove spaces | =REGEXREPLACE(CELL," ","") |
| Convert numeral to letter | =CHAR(CELL+64) |

# Features

## Custom Menu Items
*  *Square Cells* - Make all selected cells squares of some size. 20 is good for letters.
*  *Symmetrify Grid* - Make the selected cells have symmetry with regard to background color.
    Rotational (standard crossword) and bilateral are both supported.
*  *Wordsmith Anagram Solver* - Open a sidebar that will allow querying wordsmith.org/anagram
*  *Nutrimatic Solver* - Open a sidebar that will allow querying nutrimatic.org

## Added functions

Function File              | Function Name     | Usage                             | Purpose
-------------------------- | ----------------- | ---------------------------       | --------------------------------------------------
sheet_functions/caesar.js  | CAESAR_SHIFT      | CAESAR_SHIFT(string, shift)       | Shift every letter in a string by a certain amount
sheet_functions/general.js | INDEX_IN_ALPHABET | INDEX_IN_ALPHABET(index)          | Return the nth letter in the alphabet from an index.
sheet_functions/general.js | BINARY_TO_NUMBER  | BINARY_TO_NUMBER(string)          | Converts a binary string into a decimal number.
sheet_functions/general.js | TERNARY_TO_NUMBER | TERNARY_TO_NUMBER(string)         | Converts a ternary string into a decimal number.
sheet_functions/general.js | FROM_MORSE        | FROM_MORSE(string, [dot], [dash]) | Converts a string of Morse to plaintext. Supports optional dot and dash characters.
sheet_functions/general.js | TO_MORSE          | TO_MORSE(string, [delimiter])     | Converts a plaintext string to Morse.  Separates characters in output with optional delimiter.
sheet_functions/general.js | INDEX_IN_STRING   | INDEX_IN_STRING(string, index)    | Index into a string (shorthand for MID(string, index, 1))
sheet_functions/general.js | SPLIT_INTO_CELLS  | SPLIT_INTO_CELLS(string)          | Put each character of the input into its own cell to the right.
sheet_functions/general.js | ANSWERIZE         | ANSWERIZE(string, [spacesOnly])   | Strip non-alpha characters and uppercase the input.  Optionally strip spaces only.
sheet_functions/general.js | ANAGRAM           | ANAGRAM(string, [results])        | Look up anagrams and return n results (default is 10)
sheet_functions/general.js | NUTRIMATIC        | NUTRIMATIC(string, [results])     | Look up nutrimatic results for a query and return n results (default is 10)

# Using custom functions in Google Sheets

1.  Tools -> Script Editor
2.  Paste in code
3.  Save
4.  Use as normal
5.  Note that you can divide your scripts into different files.

# Reference Materials
- [Guide to extending Sheets](https://developers.google.com/apps-script/guides/sheets)
- [Validation tests (request access if you want it)](https://docs.google.com/spreadsheets/d/1WAYFVWmO9o5UXqDmf8i20E-936ubKsXBM-S3XOXdX8s/edit#gid=0)

# TODO
- .puz parser?
- Dictionary scanning--can we call out to a network from Googledoc Javascript?
- gridify (break out cells so each letter is in its own box)
