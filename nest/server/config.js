var path = require('path')
	,fs = require('fs')
	,querystring = require('querystring')
var cPath = require ('./config/path.json')

exports.path = cPath;
exports.session = require ('./config/session.json'); 
exports.etc = require ('./config/etc.json') 
exports.api = require ('./config/api.json'); ;
exports.pageCache = require('./config/page_cache.json')

var db = {
	mysql : null,
	mongo : null
}

if (fs.existsSync('./config/dbini.json')) {
	var dbini  = require ('./config/dbini.json')
	if (dbini.mongo) {
        db.mongo = dbini.mongo
    }
	if (dbini.mysql) {
		if(fs.existsSync(dbini.mysql)){

		var ini = fs.readFileSync(dbini.mysql).toString().split("\n")	
		var mysql = {
			master : []
			,slave : []
		}
		ini.forEach(function(set){
			set = set.trim()
			if ('#' == set[0]) return
			set = querystring.parse(set, ' ')
			if (dbini.mysqlbase && dbini.mysqlbase != set.db) return

			set.password = set.pass
			set.database = set.db
			
			if (1 == set.master) mysql.master.push(set)
			else mysql.slave.push(set)

		})

		db.mysql = {
			master : getSet.bind(null , mysql.master) 
			,slave : getSet.bind(null , mysql.slave) 

			}

		db.mongo = dbini.mongo
		function getSet(sets){
			if (1 == sets.length) return sets[0]
			return sets[Math.floor(Math.random() * sets.length)]
		}
		}
	}
}

var virtualHost = require('./config/virtual_host.json')
for (var i in virtualHost) {
       var hostPath = virtualHost[i],
               appConfig = {}

       var staticConfigPath = path.resolve(cPath.appPath + hostPath + '/static/config.json')
       var siteConfigPath = path.resolve(cPath.appPath + hostPath + '/config/site.json')

       appConfig.static = fs.existsSync(staticConfigPath) ? require(staticConfigPath) : {}
       appConfig.site = fs.existsSync(siteConfigPath) ? require(siteConfigPath) : {}

       console.log('load ' + hostPath + ' app config success...')

       var tplPre = hostPath.replace(/\//g, '')
       exports[tplPre] = appConfig
}

exports.virtualHost = virtualHost

exports.db = db


exports.setAbsPath = function (webRoot) {
	webRoot += '/';
	for (var p in cPath){
		if ('appPath' == p || 'views' == p || 'model' == p || 'controller' == p){
			continue
			}
		if (p != 'webRoot' && cPath[p][0] != '/') {
			cPath[p] = webRoot + cPath[p];
			}
		}
	if (cPath.appPath) cPath.appPath = path.resolve(cPath.appPath) + '/' 
	else cPath.appPath = ''
	cPath.webRoot = webRoot;
	
}
