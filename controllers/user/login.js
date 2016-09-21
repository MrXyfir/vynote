const rstring = require("randomstring");
const request = require("request");
const session = require("lib/session");
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
            // Generates a 3-day access code for user
            const generateAccessCode = () => {
                const code = rstring.generate(64);

                sql = `
                    INSERT INTO access_codes (code, expires, user_id)
                    VALUES (?, DATE_ADD(NOW(), INTERVAL 3 DAY), ?)
                `;
                cn.query(sql, [code, rows[0].user_id], (err, result) => {
                    cn.release();

                    if (err || !result.affectedRows)
                        fn(false, ""); // will fail 'get user info' and force login
                    else
                        fn(false, rows[0].user_id + "-" + code);
                });
            };

            // First login
            if (rows.length == 0) {
                let insert = {
                    xyfir_id: xid, email: body.email
                };
                sql = "INSERT INTO users SET ?";

                cn.query(sql, insert, (err, result) => {
                    if (err || !result.affectedRows) {
                        cn.release();
                        fn(true);
                    }
                    else {
                        session.save(socket.id, { uid: result.insertId, subscription: 0 });
                        generateAccessCode();
                    }
                });
            }
            // Update data
            else {
                sql = "UPDATE users SET email = ? WHERE user_id = ?";
                cn.query(sql, [body.email, rows[0].user_id], (err, result) => {
                    if (err) {
                        cn.release();
                        fn(true);
                    }
                    else {
                        session.save(socket.id, {
                            uid: rows[0].user_id, subscription: rows[0].subscription
                        });
                        generateAccessCode();
                    }
                });
            }
        }));
    });

}