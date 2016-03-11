export = (length: number) => {

    let str: string = "";

    for (let i: number = 0; i < length; i++) {
        let r = Math.random();
        str += (
            (r < 0.1)
            ? Math.floor(r * 100)
            : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65))
        );
    }

    return str;

}