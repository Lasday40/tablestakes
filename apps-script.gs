// Paste into the TableStakes Signups sheet: Extensions > Apps Script.
// Then Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
// Copy the web app URL into SHEET_ENDPOINT in index.html.

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var p = e.parameter || {};
    var clean = function (v) {
      v = String(v || '').slice(0, 1000);
      // Block formula injection from public form input
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    };
    if (p.website) { // honeypot field, bots fill it
      return ContentService.createTextOutput('ok');
    }
    sheet.appendRow([
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
    ]);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
