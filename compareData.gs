function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
      .addItem('Compare', 'compareData')
      .addToUi();
}

function compareData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet1 = ss.getSheetByName("Sheet1");
  var sheet2 = ss.getSheetByName("Sheet2");
  var sheet3 = ss.getSheetByName("Sheet3");
  var data1 = sheet1.getDataRange().getValues();
  var data2 = sheet2.getDataRange().getValues();
  var outputData = [];
  var hasExtraData = false;
  
  sheet3.clear(); // clear the previous output
  
  for (var i = 0; i < data2.length; i++) {
    var row2 = data2[i];
    var matchFound = false;
    
    for (var j = 0; j < data1.length; j++) {
      var row1 = data1[j];
      
      if (row2.toString() === row1.toString()) {
        matchFound = true;
        break;
      }
    }
    
    if (!matchFound) {
      sheet1.appendRow(row2);
      outputData.push(row2);
      hasExtraData = true;
    }
  }
  
  if (hasExtraData) {
    var addedData = "The following data was added to Sheet1:\n\n";
    
    for (var i = 0; i < outputData.length; i++) {
      var row = outputData[i];
      addedData += row.join(", ") + "\n";
    }
    
    sheet3.getRange(1, 1).setValue(addedData);
    sheet3.getRange(outputData.length + 3, 1, outputData.length, outputData[0].length).setValues(outputData);
  } else {
    sheet3.getRange(1, 1).setValue("No extra data");
  }
}
