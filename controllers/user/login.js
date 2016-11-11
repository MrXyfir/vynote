const request = require("request");
const session = require("lib/session");
const crypto = require("lib/crypto");
const db = require("lib/db");

const config = require("config");

module.exports = function(socket, data, fn) {

    let url = config.address.xacc + "api/service/12/"
        + config.keys.xacc + "/" + data.xid + "/" + data.auth;

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

        db(cn => cn.query(sql, [data.xid], (err, rows) => {
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
                    xyfir_id: data.xid, email: body.email, subscription: 0,
                    referral: "{}"
                };

                const createAccount = () => {
                    sql = "INSERT INTO users SET ?";
                    cn.query(sql, insert, (err, result) => {
                        cn.release();

                        if (err || !result.affectedRows) {
                            fn(true);
                        }
                        else {
                            session.save(socket.id, {
                                uid: result.insertId,
                                subscription: insert.subscription
                            });
                            generateAccessToken(result.insertId);
                        }
                    });
                };

                // Referral from user gives one free week + 10% off first purchase 
                if (data.referral) {
                    insert.subscription = Date.now() + ((60 * 60 * 24 * 7) * 1000);
                    insert.referral = JSON.stringify({
                        referral: data.referral, hasMadePurchase: false
                    });

                    createAccount();
                }
                // Validate affiliate promo code
                else if (data.affiliate) {
                    request.post({
                        url: config.address.xacc + "api/affiliate/signup", form: {
                            service: 12, serviceKey: config.keys.xacc,
                            promoCode: data.affiliate
                        }
                    }, (err, response, body) => {
                        if (err) {
                            createAccount();
                        }
                        else {
                            body = JSON.parse(body);

                            if (!body.error && body.promo == 3) {
                                insert.subscription = Date.now()
                                    + ((60 * 60 * 24 * 7) * 1000);
                                insert.referral = JSON.stringify({
                                    affiliate: data.affiliate,
                                    hasMadePurchase: false
                                });
                            }

                            createAccount();
                        }
                    });
                }
                else {
                    createAccount();
                }
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