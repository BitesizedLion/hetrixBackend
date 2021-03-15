const zlib = require("zlib");
const util = require("util");
//console.log(Buffer.from("VWJ1bnR1IDE4LjA0LjEgTFRTfDUuMy4xMC0xLXB2ZXww", "base64").toString("utf8"))

const gunzipPromise = util.promisify(zlib.gunzip)

async function unfuck(bae) {
    return (await gunzipPromise(Buffer.from(bae, "base64"))).toString("utf8");
}

(async function () {
    console.log(await unfuck("H4sIAO5lTWAAA6tJLckwsDY2srA2NLMGAJEQap4NAAAA"))
})();

/*
zlib.gunzip(Buffer.from("H4sIAO5lTWAAA6tJLckwsDY2srA2NLMGAJEQap4NAAAA'", "base64"), (err, buffer) => {
    console.log(buffer.toString('utf8'));
});*/