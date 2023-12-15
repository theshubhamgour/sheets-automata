function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
    .addItem('Send', 'createCalendarEventAndSendEmail')
    .addToUi();
}

function createCalendarEventAndSendEmail() {
  // Open the active spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Find the last row with data
  var lastRow = sheet.getLastRow();

  // Get the headers from the first row
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Log the headers to the console for debugging
  Logger.log('Headers: ' + headers);

  // Clean up headers by removing extra spaces and line breaks
  headers = headers.map(function (header) {
    return header.replace(/[\r\n]+/g, ''); // Remove line breaks
  });

  // Find the column index for 'Description'
  var descriptionIndex = headers.indexOf('Description') + 1;

  if (descriptionIndex === 0) {
    // 'Description' column not found
    Logger.log('Error: "Description" column not found.');
    return;
  }

  // Get the data from the last row
  var data = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Extract relevant information
  var summary = data[headers.indexOf('Summary')];
  var description = sheet.getRange(lastRow, descriptionIndex).getValue() || ''; 
  var plannedStart = data[headers.indexOf('Planned start')];
  var plannedEnd = data[headers.indexOf('Planned end')];
  var affectedEnvironment = data[headers.indexOf('Affected Environment')];

  // Format the start and end times in CST (Central Time - Chicago)
  var startTime = Utilities.formatDate(new Date(plannedStart), 'America/Chicago', 'h:mm a');
  var endTime = Utilities.formatDate(new Date(plannedEnd), 'America/Chicago', 'h:mm a');

  // List of recipients
  var recipients = ['shubham.gour@hotelkeyapp.com', 'anand.markad@hotelkeyapp.com']; 

  // Create a calendar event for each recipient
  for (var i = 0; i < recipients.length; i++) {
    var recipientEmail = recipients[i];

    // Create a calendar event
    var calendar = CalendarApp.getDefaultCalendar();
    var event = calendar.createEvent(
      summary,
      new Date(plannedStart),
      new Date(plannedEnd),
      {
        description: `Description:\n${description}\nMeeting Timing: ${startTime} - ${endTime}\nAffected Environment: ${affectedEnvironment}`
      }
    );

    // Log the event ID to the console
    Logger.log('Event ID for ' + recipientEmail + ': ' + event.getId());

    // Send email
    var subject = 'Invitation: ' + summary + ' ' + startTime;
    var body = `Hi team,\n\nWe would like to notify you that the following new event has been added to your calendar:\n\nSummary: ${summary}\n\n\nDescription: ${description}\nMeeting Timing: ${startTime} - ${endTime}\nAffected Environment: ${affectedEnvironment}\n\nThank you`;

  
    GmailApp.sendEmail(recipientEmail, subject, body);
  }
}

