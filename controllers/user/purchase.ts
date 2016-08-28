import { session } from "../../lib/session";
import db = require("../../lib/db");

interface IData {
    months: number, token: string
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    let stripeKey = require("../../config").keys.stripe;
    let amount = [0, 300, 1500, 2400][data.months];

    if (!amount) {
        fn(true, "Invalid subscription length");
        return;
    }

    let months: number = [0, 1, 6, 12][data.months];

    let info = {
        amount: amount,
        currency: "usd",
        source: data.token,
        description: `Vynote - Premium Subscription`
    };
    
    require("stripe")(stripeKey).charges.create(info, (err, charge) => {
        if (err) {
            fn(true, "Error processing your card. Please try again.");
            return;
        }

        let sql: string = "SELECT subscription FROM users WHERE user_id = ?";

        db(cn => cn.query(sql, [socket.session.uid], (err, rows) => {
            if (err || !rows.length) {
                cn.release();
                fn(true);
                return;
            }

            // Add months to current subscription expiration (or now())
            let subscription: number = rows[0].subscription == 0
                ? (Date.now() + (months * 43200 * 60 * 1000))
                : ((new Date(rows[0].subscription)).getTime() + (months * 43200 * 60 * 1000));

            // Update in database
            sql = "UPDATE users SET subscription = ? WHERE user_id = ?";
            cn.query(sql, [subscription, socket.session.uid], (err, result) => {
                cn.release();

                if (err || !result.affectedRows) {
                    fn(true);
                    return;
                }

                // Update in Redis
                socket.session.subscription = subscription;
                session.save(socket.id, socket.session);

                // Send to user
                fn(false, subscription);
            });
        }));
    });

};