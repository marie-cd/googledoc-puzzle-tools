# googledoc-puzzle-tools
Tools for easier group solving of Shinteki/Puzzle Hunt-type puzzles via Googledocs.

# Useful existing functions 
(REFS [Google's docs|https://support.google.com/docs/table/25273?hl=en]
| What the Function Does | Syntax |
| -----------------------|--------|
| Pull the [right/left] most N characters of a cell, including spaces | =right(CELL,N) |
| Pull the middle N characters of a cell, starting with letter M | =mid(CELL, M, N) |
| Find the first instance of string STR in cell | = FIND("STR",CELL) | 
| Remove spaces | =REGEXREPLACE(CELL," ","") |
| Convert numeral to letter | =char(CELL+64) |

# TODO
- Caesar shift
- .puz parser?
- Dictionary scanning--can we call out to a network from Googledoc Javascript?
- gridify (break out cells so each letter is in its own box)
