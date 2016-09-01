const request = require("request");
const session = require("lib/session");
const db = require("lib/db");

const config = require("config");

module.exports = function(socket, xid, auth, fn) {

    let url = config.address.xacc + "api/service/12/"
        config.keys.xacc + "/" + xid + "/" + auth;

    request(url, (err, response, body) => {
        body = JSON.parse(body);

        if (body.error) {
            fn(true);
            return;
        }

        db(cn => {
            let sql = "SELECT user_id, email, subscription FROM users WHERE xyfir_id = ?";
            cn.query(sql, [xid], (err, rows) => {

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
                            fn(false);
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

                            fn(false);
                        }
                    });
                }

            });
        });
    });

}