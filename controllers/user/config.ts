import db = require("../../lib/db");

interface IConfig {
    defaultExplorerObjectColor: number,
    defaultDocumentType: string,
    defaultEditorTheme: number,
    defaultCodeSyntax: number,
    defaultPageView: string,
    editorFontSize: number,
    darkTheme: boolean
}

export = (socket: SocketIO.Socket, config: IConfig, fn: Function) => {

    if (Date.now() > socket.session.subscription) {
        fn(true, "Free members cannot modify this configuration");
    }

    let sql: string = `UPDATE users SET config = ? WHERE user_id = ?`;
    db(cn => cn.query(sql, [JSON.stringify(config), socket.session.uid], (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

};