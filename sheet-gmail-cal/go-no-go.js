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
    var description = sheet.getRange(lastRow, descriptionIndex).getValue() || ''; // Use getValue()
    var plannedStart = data[headers.indexOf('Planned start')];
    var plannedEnd = data[headers.indexOf('Planned end')];
    var affectedEnvironment = data[headers.indexOf('Affected Environment')];
  
    // Format the start and end times in CST (Central Time - Chicago)
    var startTime = Utilities.formatDate(new Date(plannedStart), 'America/Chicago', 'h:mm a');
    var endTime = Utilities.formatDate(new Date(plannedEnd), 'America/Chicago', 'h:mm a');
  
    // List of recipients
    var recipients = ['shubham.gour@hotelkeyapp.com', 'anand.markad@hotelkeyapp.com']; // Add or remove email addresses as needed
  
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
  
      // Create "GO-NO-GO" event
      var goNoGoStartTime = new Date(plannedStart.getTime() - 12 * 60 * 60 * 1000); // 12 hours before the planned start
      var goNoGoStartString = Utilities.formatDate(goNoGoStartTime, 'America/Chicago', 'h:mm a');
      var goNoGoEndString = Utilities.formatDate(new Date(goNoGoStartTime.getTime() + 60 * 60 * 1000), 'America/Chicago', 'h:mm a'); // 1 hour duration
  
      var goNoGoEvent = calendar.createEvent(
        'GO-NO-GO: ' + summary,
        goNoGoStartTime,
        new Date(goNoGoStartTime.getTime() + 60 * 60 * 1000), // 1 hour duration
        {
          description: `This is a reminder for the upcoming event:\n\nSummary: ${summary}\n\nDescription: ${description}\nMeeting Timing: ${goNoGoStartString} - ${goNoGoEndString}\nAffected Environment: ${affectedEnvironment}`
        }
      );
  
      // Log the event ID to the console
      Logger.log('GO-NO-GO Event ID for ' + recipientEmail + ': ' + goNoGoEvent.getId());
  
      // Send email for "GO-NO-GO" event
      var goNoGoSubject = 'GO-NO-GO Reminder: ' + summary + ' ' + goNoGoStartString;
      var goNoGoBody = `Hi team,\n\nThis is a reminder for the upcoming event:\n\nSummary: ${summary}\n\nDescription: ${description}\nMeeting Timing: ${goNoGoStartString} - ${goNoGoEndString}\nAffected Environment: ${affectedEnvironment}\n\nThank you`;
  
      // Attach calendar card to the email for "GO-NO-GO" event
      var goNoGoCalendarCard = CalendarApp.getCalendarById(calendar.getId()).createAllDayEvent(
        'GO-NO-GO Event',
        goNoGoStartTime,
        {
          description: `This is a reminder for the upcoming event:\n\nSummary: ${summary}\n\nDescription: ${description}\nMeeting Timing: ${goNoGoStartString} - ${goNoGoEndString}\nAffected Environment: ${affectedEnvironment}`
        }
      );
      
      // Send email for "GO-NO-GO" event with attached calendar card
      GmailApp.sendEmail({
        to: recipientEmail,
        subject: goNoGoSubject,
        body: goNoGoBody,
        attachments: [goNoGoCalendarCard.getEventSeriesId()] // Use getEventSeriesId to attach the calendar card
      });
    }
  }
  
