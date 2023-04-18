function compareData() {
  // Get the first sheet
  var sheet1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
  // Get the second sheet
  var sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet2');
  
  // Get the output sheet
  var sheet3 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet3');
  
  // Clear the previous output
  sheet3.clearContents();
  
  // Get the data from the first sheet
  var data1 = sheet1.getDataRange().getValues();
  
  // Get the data from the second sheet
  var data2 = sheet2.getDataRange().getValues();
  
  // Compare the data from both sheets and append any new rows to the first sheet
  var addedData = [];
  for (var i = 0; i < data2.length; i++) {
    var row2 = data2[i];
    var found = false;
    for (var j = 0; j < data1.length; j++) {
      var row1 = data1[j];
      if (row1.toString() == row2.toString()) {
        found = true;
        break;
      }
    }
    if (!found) {
      sheet1.appendRow(row2);
      addedData.push(row2);
    }
  }
  
  // Print the added data to the output sheet
  if (addedData.length > 0) {
    sheet3.getRange(1, 1).setValue('The following data was added to Sheet1:');
    sheet3.getRange(2, 1, addedData.length, addedData[0].length).setValues(addedData);
  } else {
    sheet3.getRange(1, 1).setValue('No Extra data');
  }
}
