const querystring = require('node:querystring') // 引入 node:querystring 模块解析url
var { post } = require("./request")
const { WriteData, isUrl } = require("./utils")

function getdata(req, res) {
    // 数据格式
    console.log('content-type', req.headers['content-type'])
    // 接收数据
    let postData = ''
    req.on('data', chunk => {
        postData += chunk.toString()
    })
    req.on('end', async () => {
        req.query = querystring.parse(req.url.split('?')[1]) // 通过 ? 问号 分隔参数，并使用 querystring.parse 解析问号后面的参数
        if (!req.query.url) {
            WriteData(res, "缺少URL参数", 200);
        }
        else if (!isUrl(req.query.url)) {
            WriteData(res, "参数格式不正确，不是URL", 200);
        }
        else {
            req.query.url = decodeURIComponent(req.query.url);
            console.log(req.query.url)
            let data = await post(req.query.url);
            console.log(data)
            WriteData(res, "success", 200, data, 1);
        }
    })
}

module.exports = {
    getdata: getdata
};