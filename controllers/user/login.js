const request = require("request");
const session = require("lib/session");
const crypto = require("lib/crypto");
const db = require("lib/db");

const config = require("config");

module.exports = function(socket, xid, auth, fn) {

    let url = config.address.xacc + "api/service/12/"
        + config.keys.xacc + "/" + xid + "/" + auth;

    request(url, (err, response, body) => {
        // Error in request
        if (err) {
            fn(true);
            return;
        }

        body = JSON.parse(body);

        // Error from Xyfir Accounts
        if (body.error) {
            fn(true);
            return;
        }

        let sql = "SELECT user_id, subscription FROM users WHERE xyfir_id = ?";

        db(cn => cn.query(sql, [xid], (err, rows) => {
            // Build / encrypt access token and send to client
            const generateAccessToken = (uid) => {
                const token = crypto.encrypt(
                    uid + "-" + body.accessToken,
                    config.keys.accessToken
                );
                
                fn(false, token);
            };

            // First login
            if (rows.length == 0) {
                let insert = {
                    xyfir_id: xid, email: body.email
                };
                sql = "INSERT INTO users SET ?";

                cn.query(sql, insert, (err, result) => {
                    cn.release();

                    if (err || !result.affectedRows) {
                        fn(true);
                    }
                    else {
                        session.save(socket.id, { uid: result.insertId, subscription: 0 });
                        generateAccessToken(result.insertId);
                    }
                });
            }
            // Update data
            else {
                sql = "UPDATE users SET email = ? WHERE user_id = ?";
                cn.query(sql, [body.email, rows[0].user_id], (err, result) => {
                    cn.release();

                    if (err) {
                        fn(true);
                    }
                    else {
                        session.save(socket.id, {
                            uid: rows[0].user_id, subscription: rows[0].subscription
                        });
                        generateAccessToken(rows[0].user_id);
                    }
                });
            }
        }));
    });

}