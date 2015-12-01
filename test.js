var eve = require('./lib/EveClient')
eve.setUserAgent('Testing EveApi-Node/0.0.1')
// eve.setCache('file');
var key = require('./test/testUtils').getUserEveKey()
var config = require('./test/config')


eve.transformAllResponses = function(resp){
	var results = {};
	results.eveapi = resp.eveapi.$
	results.cachedUntil = resp.eveapi.cachedUntil[0]
	results.currentTime = resp.eveapi.currentTime[0]
	if(resp.eveapi.result) results.result = resp.eveapi.result[0]
	return results
}
eve.accountStatus.transformResponseData = function(resp){
	resp.result.paidUntil = resp.result.paidUntil[0]
	resp.result.createDate = resp.result.createDate[0]
	resp.result.logonCount = resp.result.logonCount[0]
	resp.result.logonMinutes = resp.result.logonMinutes[0]	
	return resp
}

var dataHandler = function dataHandler(data) {
	console.log("test data: ", data)	
}
var errorHandler = function(e){
					console.log("error: ", e)
				}
var cb = function cb(err, data) {
	if(err) console.log("test err: ", err)
	if(data) console.log("test data: ", data)
	return
}
eve.setHost('api.testeveonline.com')
eve.setApiKey(key)
// eve.serverStatus.fetchP().then(dataHandler)
// eve.characterID.fetch('Biae', cb)
// eve.characters.fetchP({})
// 				.then(dataHandler)
// 				.catch(errorHandler)

// eve.skillQueue.fetchP({characterID: config.TEST_CHARID})
// 				.then(dataHandler)
// 				.catch(errorHandler)

// eve.charAccountBalance.fetchP({characterID: config.TEST_CHARID})
// 				.then(dataHandler)
// 				.catch(errorHandler)

eve.characterSheet.fetchP({characterID: config.TEST_CHARID})
				.then(dataHandler)
				.catch(errorHandler)