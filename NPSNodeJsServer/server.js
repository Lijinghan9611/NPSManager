var http = require('http');
const { getdata } = require("./route")
var app = http.createServer()
const { WriteData } = require("./utils")

const { route_getdata } = require("./config");

app.on('request', (req, res) => {
    try {
        let path = req.url.split("?")[0].split("#")[0];
        console.log(path)
        if ((path == route_getdata) || (path == route_getdata + '/') && req.method == 'POST') {    //获取数据
            getdata(req, res);
        } else {    //404
            WriteData(res, "", 404);
        }
    } catch (error) {
        WriteData(res, error.message)
    }
})


app.listen(8124);