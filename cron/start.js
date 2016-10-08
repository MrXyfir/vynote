const cron = require("cron");

/*
    Sets cronjobs to run at appropriate times
    Handles errors / responses from jobs
*/
module.exports = function() {
    
    const jobs = {
        deleteExpiredDocumentVersions: require("./delete-expired-document-versions")
    };

    // Delete document versions over a week old
    // Runs once a day
    // Retries once on failure
    new cron.CronJob("0 1 * * *", () => jobs.deleteExpiredDocumentVersions(err => {
        if (err) jobs.deleteExpiredDocumentVersions(err => { return; });
    }), () => { return; }, true);

};