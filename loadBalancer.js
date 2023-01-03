const express = require('express');
const request = require('request');
var cp = require('child_process');
const { exec } = require('child_process');
let servers = [
    { link: 'http://localhost:5000', status: 'up', port: '5000', fileName: 'server1.js'},
    { link: 'http://localhost:5001', status: 'up', port: '5001', fileName: 'server2.js'},
    { link: 'http://localhost:5002', status: 'up', port: '5002', fileName: 'server3.js'}
];

const healthChecks = () => {
    servers.forEach((server, i) => {
        request(server.link, (error, response, body) => {
            if(error){
                servers[i].status = 'down';
                restartServer(i);
            }
            
        });
    });
}
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const restartServer = async (server) => {
    console.log(servers[server].port, ":killing server");
    // let yourscript = exec('sh reboot.sh ${server}',
    //     (error, stdout, stderr) => {
    //         console.log(stdout);
    //         console.log(stderr);
    //         if (error !== null) {
    //             console.log(`exec error: ${error}`);
    //         }
    //     });
        console.log(`./reboot.sh ${servers[server].port}`)
        cp.exec(`./reboot.sh ${servers[server].port}`, function(error, stdout, stderr) {
            // handle err, stdout, stderr
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
          });
        await delay(1000);
        console.log(servers[server].port, ": starting new server");
        cp.exec(`node ${servers[cur].fileName}`, function(error, stdout, stderr) {
        // handle err, stdout, stderr
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
        });
}

let cur = 0;


const timeGatingMiddleware = (req, res, next) => {
    const start = Date.now();
    // The 'finish' event comes from core Node.js, it means Node is done handing
    // off the response headers and body to the underlying OS.
    res.on('finish', () => {
      console.log('Request got Completed in :', Date.now() - start);
    });
    next();
  };
const handler = async (req, res) => {
    // Add an error handler for the proxied request
    
            const _req = request({ url: servers[cur].link + req.url }).on('error', error => {
                servers[cur].status = 'down';
                res.status(500).send(error.message);
                cur = (cur + 1) % servers.length; 
                restartServer(cur); 
            });
            // using pipe operator to directly pipe the _req to res
            req.pipe(_req).pipe(res);
            cur = (cur + 1) % servers.length;
   
  };
const server = express().use(timeGatingMiddleware).get('*', handler).post('*', handler);

server.listen(4000, () => {
    setInterval(healthChecks, 5000);
});