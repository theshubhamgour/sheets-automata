 function createSnapshot() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
       var date = new Date();
          var name = sheet.getName() + " - " + date.toLocaleString();
             var folder = DriveApp.getFolderById("1Fv4GuKVEJGQOJAX-l4klsdiaxYh3nS5Z"); // FOLDER_ID of the Hilton SnapShot folder 
                var file = folder.createFile(sheet.getAs("application/pdf")).setName(name);
                }
