var cluster = require('cluster')
	,fs = require("fs");

//var conf = require('./apps/nest/server/config/etc.json')
//console.log(conf)
var numCPUs = 1 || require('os').cpus().length

cluster.setupMaster({
    exec : 'nest/server/server.js',
    args : [],
    silent : false
})

for(var i = numCPUs ; i--;){
    cluster.fork()
}

cluster.on('exit', function(worker) {
	var st = new Date
	st = st.getFullYear()+ '-'+ (st.getMonth()+1)+ '-'+st.getDate()+ ' '+st.toLocaleTimeString()
	console.log('worker ' + worker.process.pid + ' died at:',st);
	cluster.fork()
 })



fs.createWriteStream("nest/server/config/pids", {
flags: "a",
encoding: "utf-8",
mode: 0666
}).write(process.pid + "\n");

