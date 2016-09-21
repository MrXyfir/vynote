const session = require("lib/session");
const db = require("lib/db");

const config = require("config");

module.exports = function(socket, code, fn) {

    db(cn => {
        let sql = "";

        // Get a user's information using uid
        // Create / update session if uid is valid
        const getInfo = (uid) => {
            sql = `
                SELECT email, config, subscription FROM users WHERE user_id = ?
            `;
            cn.query(sql, [uid], (err, rows) => {
                if (err || !rows.length) {
                    fn(false);
                }
                // Grab user's shortcuts if user has subscription
                else if (rows[0].subscription > Date.now()) {
                    sql = "SELECT name, content FROM shortcuts WHERE user_id = ?";
                    cn.query(sql, [uid], (err, shortcuts) => {
                        cn.release();

                        session.save(
                            socket.id, { uid, subscription: rows[0].subscription }
                        );

                        rows[0].shortcuts = shortcuts;
                        fn(true, rows[0]);
                    });
                }
                else {
                    cn.release();
                    session.save(
                        socket.id, { uid, subscription: rows[0].subscription }
                    );
                    fn(true, rows[0]);
                }
            });
        };

        // Attempt to create a session before returning info
        if (!socket.session.uid) {
            // Validate access code
            if (code) {
                code = code.split('-');

                sql = `
                    SELECT user_id FROM access_codes WHERE user_id = ? AND code = ?
                    AND expires > NOW()
                `;
                cn.query(sql, [code[0], code[1]], (err, rows) => {
                    // Invalid code, force login
                    if (err || !rows.length) {
                        cn.release();
                        fn(false);
                    }
                    // Get user's info and create session
                    else {
                        // Update access code's expiration date
                        sql = `
                            UPDATE access_codes SET expires = DATE_ADD(NOW(), INTERVAL 3 DAY)
                            WHERE user_id = ? AND code = ?
                        `;
                        cn.query(sql, [code[0], code[1]], (err, result) => {
                            getInfo(rows[0].user_id);
                        });
                    }
                });
            }
            // Get info / create session for dev user
            else if (config.environment.type == "dev") {
                getInfo(1);
            }
            // No access code and not dev user, force login
            else {
                cn.release();
                fn(false);
                return;
            }
        }
        // Get info using session's uid
        else {
            getInfo(socket.session.uid);
        }
    });

}