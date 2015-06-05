# googledoc-puzzle-tools
Tools for easier group solving of Shinteki/Puzzle Hunt-type puzzles via Googledocs.

# Useful existing functions 
(REFS [Google's docs](https://support.google.com/docs/table/25273?hl=en))

| What the Function Does | Syntax |
| -----------------------|--------|
| Pull the [right/left] most N characters of a cell, including spaces | =right(CELL,N) |
| Pull the middle N characters of a cell, starting with letter M | =mid(CELL, M, N) |
| Find the first instance of string STR in cell | = FIND("STR",CELL) | 
| Remove spaces | =REGEXREPLACE(CELL," ","") |
| Convert numeral to letter | =char(CELL+64) |

# Added functions

Function File             | Function Name | Usage                       | Purpose
--------------------------| ------------- | --------------------------- | ---------------------------------------------------
sheet_functions/caesar.js | CAESAR_SHIFT  | CAESAR_SHIFT(string, shift) | Shift every letter in a string by a certain amount

# Using custom functions in Google Sheets

1.  Tools -> Script Editor
2.  Paste in code
3.  Save
4.  Use as normal

# Reference Materials
[Guide to extending Sheets](https://developers.google.com/apps-script/guides/sheets)

# TODO
- Caesar shift
- .puz parser?
- Dictionary scanning--can we call out to a network from Googledoc Javascript?
- gridify (break out cells so each letter is in its own box)
