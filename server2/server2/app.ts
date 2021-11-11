import http, { IncomingMessage, Server, ServerResponse } from "http";
import cheerio from 'cheerio';
import request from 'request';
/*
implement your server code here
*/


const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {

    if (req.method === "GET") {
    let inputPromise = new Promise((resolve,reject)=>{
      try{
        let body = ''
        req.on('data', (chunk) => {
          body += chunk.toString()
        })
        req.on('end', () => {
          resolve(body)
        })
      }catch (error){
        reject(error)
      }
      })
      allData();
      async function allData() {
        const websiteUrl = await inputPromise as string
        request(websiteUrl, (error,response,html)=> {
          console.log(response.statusCode)
          if(!error && response.statusCode === 200){
              const info = cheerio.load(html);
              const heading = info('head title').text() || null;
              const description = info('meta[name="description"]').attr('content') || null
              const links = info('img');
              const urls = [];
          for (const i of links) {
              urls.push(i.attribs.src)
            }
            res.end(JSON.stringify({heading,description,urls}, null, 4))
          } else {
            res.writeHead(400, {'content-type': 'application/json'})
            res.end(JSON.stringify({message:'error'}))
          }
      })

      }
    }
  }
);

server.listen(3001, ()=> {

});
