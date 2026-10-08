// TableStakes signup form handler.
// Paste ALL of this into Extensions > Apps Script in the TableStakes Signups sheet.

var SHEET_ID = '13yy9YQkriSqenJX25042swKWSDTCaR-Bq8NQH-3G6K4';
var NOTIFY_EMAIL = 'lasday.david@gmail.com';

// Visiting the web app URL in a browser shows this, so you can confirm it is live.
function doGet() {
  return ContentService.createTextOutput('TableStakes signup endpoint is live.');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    var p = (e && e.parameter) || {};
    var clean = function (v) {
      v = String(v || '').slice(0, 1000);
      // Block formula injection from public form input
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    };
    if (p.website) { // honeypot field, bots fill it
      return ContentService.createTextOutput('ok');
    }
    var row = [
      new Date(),
      clean(p.type),
      clean(p.name),
      clean(p.email),
      clean(p.company),
      clean(p.role),
      clean(p.linkedin),
      clean(p.city),
      clean(p.budget),
      clean(p.audience),
      clean(p.notes)
    ];
    sheet.appendRow(row);

    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New TableStakes signup: ' + row[1] + ' / ' + row[2],
        body: [
          'Type: ' + row[1],
          'Name: ' + row[2],
          'Email: ' + row[3],
          'Company: ' + row[4],
          'Role: ' + row[5],
          'LinkedIn: ' + row[6],
          'City: ' + row[7],
          'Budget / sponsorship: ' + row[8],
          'Audience / guests: ' + row[9],
          'Notes: ' + row[10],
          '',
          'Sheet: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit'
        ].join('\n'),
        replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[3]) ? row[3] : NOTIFY_EMAIL
      });
    } catch (mailErr) {
      // The row is already saved; a mail problem should not lose the signup.
    }

    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
