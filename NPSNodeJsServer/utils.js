/**
 * 判断是否是url
 * @param {*} str url
 * @returns 
 */
function isUrl(str) {
    var v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    return v.test(str);
}

/**
 * 返回数据
 * @param {*} res 
 * @param {*} msg 返回信息
 * @param {*} code http状态吗
 * @param {*} data 返回数据
 * @param {*} recode 返回数据中的code
 */
function WriteData(res, msg, code, data, recode) {
    code = code || 500
    recode = recode || 0;
    if (code == 404) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end()
    }
    else {
        res.writeHead(code, { 'Content-Type': 'application/json' });

        let sendData = {
            msg: msg,
            code: recode,
            isFromProxy: true,
        }

        if (data) {
            sendData.data = data;
        }

        res.end(JSON.stringify(sendData));
    }
}

module.exports = {
    WriteData: WriteData,
    isUrl: isUrl
};