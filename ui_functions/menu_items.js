/** @OnlyCurrentDoc */

function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  if (e && e.authMode == "NONE") {
    // If this is an add-on, it may not have been enabled for this sheet yet, so we add
    // just a single option to the menu, which will kickstart the add-on and add the rest
    // of the menu options when selected.
    _getSpreadsheetUI().createMenu('Puzzle Tools')
    .addItem('Enable for this sheet', '_updateMenus')
    .addToUi();
  } else {
    _updateMenus();
  }
}

/**
 * Helper function used to add all the menu options for this script.
 */
function _updateMenus() {
  _getSpreadsheetUI().createMenu('Puzzle Tools')
  .addItem('Square Cells', 'squareCells')
  .addSubMenu(_getSpreadsheetUI().createMenu('Symmetrify Grid')
              .addItem('Rotationally', 'doRotationalSymmetrification')
              .addItem('Bilaterally', 'doBilateralSymmetrification'))
  .addItem('Quick-Add Named Tabs', 'doAddNamedTabs')
  .addSeparator()
  .addItem('Wordsmith Anagram Solver', 'doOpenWordsmithAnagrammer')
  .addItem('Nutrimatic Solver', 'doOpenNutrimatic')
  .addToUi();
}

/**
 * Ask the user for a set of comma-delimited names and make tabs with the names.
 */
function doAddNamedTabs() {
  var ui = _getSpreadsheetUI();
  var result = ui.prompt("Adding Tabs","Enter a comma-delimited list of tab names.", ui.ButtonSet.OK_CANCEL);
  if (_shouldContinueFromDialog(result)) {
    var names = result.getResponseText();
    if (names == null || names == "") {
      return;
    }
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var tabNames = names.split(",");
    tabNames.forEach( function(tabName) {spreadsheet.insertSheet(tabName.trim());} );
  }
}

/**
 * Given a set of cells, ensure that cells are reflected at the 180-degree point.
 * In other words, a cell in the upper left will get the same color in the lower right.
 */
function doRotationalSymmetrification() {
  var cells = _getActiveRange();
  _doSymmetrification(Math.ceil(cells.getNumRows()/2), cells.getNumColumns(),
                      function(seedRow, seedColumn, selectedCells) {
                        // find rotationally symmetric cell. Which is the total number of rows minus the current row minus 1
                        // if we're in row 1 above in a 5-row grid, we want the mirror row to be 5 - (1 - 1) = 5
                        // if we're in row 2, we want the mirror row to be 5 - (2 - 1) = 4
                        // and if we're in row 3, we want the mirror row to be (5 - (3 - 1)) = 3
                        // the same logic applies to the columns
                        return selectedCells.getCell(selectedCells.getNumRows() - (seedRow - 1),
                                                     selectedCells.getNumColumns() - (seedColumn - 1));
                      });
}

/**
 * Given a set of cells, ensure that cells to the right of the central column mirror the ones on the left side.
 */
function doBilateralSymmetrification() {
  var cells = _getActiveRange();
  _doSymmetrification(cells.getNumRows(), Math.ceil(cells.getNumColumns()/2),
                      function(seedRow, seedColumn, selectedCells) {
                        return selectedCells.getCell(seedRow,
                                                     selectedCells.getNumColumns() - (seedColumn - 1));
                      });

}

/**
 * Symmetrify the grid based on the passed-in parameters.
 *
 * @param {Number} the max row to look at (relative to the range upper-left)
 * @param {Number} the max column to look at (relative to the range upper-left)
 * @param {Function} a callback function that takes row, column of a given cell, and selectedCells and returns the _mirroring_ cell to affect
 */
function _doSymmetrification(maxRow, maxColumn, callback) {
  var cells = _getActiveRange();
  var topRow = cells.getRow();
  var leftColumn = cells.getColumn();
  for (var curRelativeRow = 1; curRelativeRow <= maxRow; curRelativeRow++) {
    for (var curRelativeColumn = 1; curRelativeColumn <= maxColumn; curRelativeColumn++) {
      var currentCell = cells.getCell(curRelativeRow, curRelativeColumn);

      var mirrorCell = callback(curRelativeRow, curRelativeColumn, cells);
      // this gives a substantial (4x in quick tests) speedup, since setting the background color causes a refresh
      if (currentCell.getBackgroundColor() != mirrorCell.getBackgroundColor()) {
        mirrorCell.setBackgroundColor(currentCell.getBackgroundColor());
      }
    }
  }
}

/**
 * Given a set of cells, set their columns and rows to the same size. Useful for a grid of
 * square cells for use with crosswords and so on.
 */
function squareCells() {
  var cells = _getActiveRange();
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var startingColumn = cells.getColumn();
  var startingRow = cells.getRow();
  var dialogResult = _getCellSizeResultFromUser();
  if (_shouldContinueFromDialog(dialogResult)) {
     var newCellSize = parseInt(dialogResult.getResponseText());
     // because we need to manipulate the columns within the global context
     // of the sheet, we start at startingColumn and then proceed to
     // startingColumn + the number of columns
     // so starting at 2 for 3 columns would give 2,3,4
     for (var col = startingColumn; col < startingColumn + cells.getNumColumns(); col++) {
        sheet.setColumnWidth(col, newCellSize);
     }
     // see above comment about column counts
     for (var row = startingRow; row < startingRow + cells.getNumRows(); row++) {
       sheet.setRowHeight(row, newCellSize);
     }
  }

}

/**
 * Lays out a series of cells, starting with the active cell to use with a simple substitution key.
 *
 */
function doSetupSimpleSubstitutionKey() {
  var range = _getActiveRange();
  var startRow = range.getRow();
  var startColumn = range.getColumn();
  for (var curRow = startRow; curRow <= startRow + 26; curRow++) {
  }
}

/**
 * Creates the sidebar necessary for querying wordsmith.org/anagram
 */
function doOpenWordsmithAnagrammer() {
  var template = HtmlService.createTemplateFromFile('web_query_form')
  template.source = WORDSMITH_SEARCH;
  var html = template.evaluate().setTitle('Wordsmith Anagrammer');
  _getSpreadsheetUI().showSidebar(html);
}

/**
 * Creates the sidebar necessary for querying wordsmith.org/anagram
 */
function doOpenNutrimatic() {
  var template = HtmlService.createTemplateFromFile('web_query_form')
  template.source = NUTRIMATIC_SEARCH;
  var html = template.evaluate().setTitle('Nutrimatic');
  _getSpreadsheetUI().showSidebar(html);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Given a range of cells, rotate the square 90-degrees. Note that this will alert if you don't select a square.
 */
function doRotateGrid() {
  var range = _getActiveRange();
  if (range.getNumRows() != range.getNumColumns()) {
    var ui = _getSpreadsheetUI();
    ui.alert("Selected area must be square.");
    return;
  }
}

/**
 * Gets a cell size from the user
 * @return {Integer} the size the user requested
 */
function _getCellSizeResultFromUser() {
  var ui = _getSpreadsheetUI();
  return ui.prompt("Setting Cell Size","Enter a cell size in pixels", ui.ButtonSet.OK_CANCEL);
}

/**
 * Determines if the dialog result was a cancel.
 * @param {Object} a dialog result.
 * @return true if the user pressed cancel, false if not
 */
function _didPressCancel(dialogResult) {
  var ui = _getSpreadsheetUI();
  return dialogResult.getSelectedButton() == ui.Button.CANCEL;
}

/**
 * Determines if the dialog text is empty.
 * @param {Object} a dialog result
 * @return true if the entered text is empty.
 */
function _isDialogPromptTextEmpty(dialogResult) {
  return dialogResult.getResponseText() == null || dialogResult.getResponseText() == "";
}

/**
 * Determine if the dialog result suggests that the user should continue.
 * @param {Object} the dialog result object
 * @return true if the dialog result suggests something that should continue, false if not.
 */
function _shouldContinueFromDialog(dialogResult) {
  return !(_didPressCancel(dialogResult) || _isDialogPromptTextEmpty(dialogResult));
}

/**
 * Refactored logic for getting the spreadsheet UI.
 * @return SpreadsheetApp UI object
 */
function _getSpreadsheetUI() {
  return SpreadsheetApp.getUi();
}

/**
 * Return the active range of cells.
 * Refactored code.
 */
function _getActiveRange() {
  return  SpreadsheetApp.getActiveRange();
}
