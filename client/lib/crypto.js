import crypto from "crypto-browserify";

export function encrypt(value, encKey) {
	try {
		var cipher = crypto.createCipher("aes-256-ctr", encKey)
		var crypted = cipher.update(value, 'utf8', 'hex')
		
		crypted += cipher.final('hex');
		
		return crypted;
	}
	catch (e) { return ""; }
}

export function decrypt(value, decKey) {
	try {
		var decipher = crypto.createDecipher("aes-256-ctr", decKey)
		var dec = decipher.update(value, 'hex', 'utf8')
		
		dec += decipher.final('utf8');
		
		return dec;
	}
	catch (e) { return ""; }
}

export function hash(value, alg) {
	return crypto.createHash(alg).update(value).digest('hex');
}