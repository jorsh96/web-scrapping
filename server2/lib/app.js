"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cheerio_1 = __importDefault(require("cheerio"));
const request_1 = __importDefault(require("request"));
/*
implement your server code here
*/
const server = http_1.default.createServer((req, res) => {
    if (req.method === "GET") {
        let inputPromise = new Promise((resolve, reject) => {
            try {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    resolve(body);
                });
            }
            catch (error) {
                reject(error);
            }
        });
        allData();
        async function allData() {
            const websiteUrl = await inputPromise;
            request_1.default(websiteUrl, (error, response, html) => {
                console.log(response.statusCode);
                if (!error && response.statusCode === 200) {
                    const info = cheerio_1.default.load(html);
                    const heading = info('head title').text() || null;
                    const description = info('meta[name="description"]').attr('content') || null;
                    const links = info('img');
                    const urls = [];
                    for (const i of links) {
                        urls.push(i.attribs.src);
                    }
                    res.end(JSON.stringify({ heading, description, urls }, null, 4));
                }
                else {
                    res.writeHead(400, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ message: 'error' }));
                }
            });
        }
    }
});
server.listen(3001, () => {
    console.log('server is running.....');
});
