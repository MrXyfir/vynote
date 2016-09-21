const cron = require("cron");

/*
    Sets cronjobs to run at appropriate times
    Handles errors / responses from jobs
*/
module.exports = function() {
    
    const jobs = {
        deleteExpiredDocumentVersions: require("./delete-expired-document-versions"),
        deleteExpiredAccessCodes: require("./delete-expired-access-codes")
    };

    // Delete document versions over a week old
    // Runs once a day
    // Retries once on failure
    new cron.CronJob("0 1 * * *", () => jobs.deleteExpiredDocumentVersions(err => {
        if (err) jobs.deleteExpiredDocumentVersions(err => { return; });
    }), () => { return; }, true);

    // Delete access codes over 3 days old
    // Runs every 6th hour
    // Retries once on failure
    new cron.CronJob("0 1/6 * * *", () => jobs.deleteExpiredAccessCodes(err => {
        if (err) jobs.deleteExpiredAccessCodes(err => { return; });
    }), () => { return; }, true);

};