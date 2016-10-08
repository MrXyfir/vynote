const request = require("request");
const session = require("lib/session");
const crypto = require("lib/crypto");
const db = require("lib/db");

const config = require("config");

module.exports = function(socket, token, fn) {

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
                        
                        session.save(socket.id, {
                            uid, subscription: rows[0].subscription
                        });

                        rows[0].shortcuts = shortcuts;
                        fn(true, rows[0]);
                    });
                }
                else {
                    cn.release();
                    session.save(socket.id, {
                        uid, subscription: rows[0].subscription
                    });
                    fn(true, rows[0]);
                }
            });
        };

        // Validate access token
        if (token) {
            // [user_id, access_token]
            token = crypto.decrypt(token, config.keys.accessToken).split('-');

            // Invalid token
            if (!token[0] || !token[1]) {
                cn.release();
                fn(false);
                return;
            }

            // Get user's Xyfir ID
            sql = `SELECT xyfir_id FROM users WHERE user_id = ?`;

            cn.query(sql, [token[0]], (err, rows) => {
                // User doesn't exist
                if (err || !rows.length) {
                    cn.release();
                    fn(false);
                }
                // Validate access token with Xyfir Accounts
                else {
                    let url = config.address.xacc + "api/service/12/"
                    + `${config.keys.xacc}/${rows[0].xyfir_id}/${token[1]}`;

                    request(url, (err, response, body) => {
                        // Error in request
                        if (err) {
                            fn(false);
                            return;
                        }

                        body = JSON.parse(body);

                        // Error from Xyfir Accounts
                        if (body.error)
                            fn(false);
                        // Access token valid
                        else
                            getInfo(token[0]);
                    });
                }
            });
        }
        // Get info / create session for dev user
        else if (config.environment.type == "dev") {
            getInfo(1);
        }
        // No access token and not dev user, force login
        else {
            cn.release();
            fn(false);
            return;
        }
    });

}