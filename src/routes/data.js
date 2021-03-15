const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path")
const CircularJSON = require('circular-json');
const zlib = require("zlib");
const util = require("util");
var reqCount = 0;

router.post('/rollsad', async (req, res) => {
    reqCount += 1
    fs.writeFileSync(`./rollsad-${reqCount}.json`, CircularJSON.stringify(req));

    let data = (req.body.d).split("|");
    data[data.length - 1] = data[data.length - 1].replace("\n", "")

    for (const i in data) {
        if (data[i] == "") continue;
        if (/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(data[i])) {
            if (Buffer.from(data[i], "base64").toString("utf8").includes("\x1F")) continue;
            data[i] = Buffer.from(data[i], "base64").toString("utf8");
        }
    }
    console.log(data)
    console.log(await die(data))
});

async function die(unParsed) {
    return {
        "System": {
            "OS": unParsed[0],
            "Uptime": unParsed[1]
        },
        "CPUInfo": {
            "CPUModel": unParsed[2],
            "CPUSpeed": unParsed[3],
            "CPUCores": unParsed[4],
            "CPUUsage": unParsed[5],
            "IOWait": unParsed[6]
        },
        "RAMInfo": {
            "RamTotal": unParsed[7],
            "RamUsage": unParsed[8],
            "SwapTotal": unParsed[9],
            "SwapUsage": unParsed[10]
        },
        "DiskInfo": {
            "DiskUsage": {
                "MountPoint": (await unfuck(unParsed[11])).split(",")[0],
                "Available": (await unfuck(unParsed[11])).split(",")[3],
                "Used": (await unfuck(unParsed[11])).split(",")[2],
                "1Blocks": (await unfuck(unParsed[11])).split(",")[1]
            },
            "DriveHealth": await unfuck(unParsed[15]),
            "INodes": {
                "MountPoint": (await unfuck(unParsed[20])).split(",")[0],
                "INodes": (await unfuck(unParsed[20])).split(",")[1],
                "IUsed": (await unfuck(unParsed[20])).split(",")[2],
                "IFree": (await unfuck(unParsed[20])).split(",")[3]
            },
            //"IOPS": await unfuck(unParsed[18]),
            "Raid": await unfuck(unParsed[14]) // raid related
        },
        "NetworkDetails": {
            //"NICs": await unfuck(unParsed[12]), // net related
            "PortConns": unParsed[19],
        },
        "ServiceStatuses": (unParsed[13]).includes(";") ? unParsed[13].split(";") : unParsed[13], // whatever this is (empty for me)
        "LastProcesses": unParsed[16],
        "CurrentProcesses": unParsed[17],
    }
}

const gunzipPromise = util.promisify(zlib.gunzip);

async function unfuck(bae) {
    return (await gunzipPromise(Buffer.from(bae, "base64"))).toString("utf8");
}

module.exports = router;
