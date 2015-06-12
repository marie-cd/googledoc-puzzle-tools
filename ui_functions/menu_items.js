function onOpen() {
  var ui = _getSpreadsheetUI();
  // Or DocumentApp or FormApp.
  ui.createMenu('Puzzle Tools')
      .addItem('Square Cells', 'squareCells')
      .addToUi();
}  


/**
 * Given a set of cells, set their columns and rows to the same size. Useful for a grid of
 * square cells for use with crosswords and so on.
 */
function squareCells() {
  var cells = SpreadsheetApp.getActiveRange();
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