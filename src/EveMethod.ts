
import _ = require('lodash');
import path = require('path');
import globals = require('./globals')

import utils = require('./utils');
import Error = require('./Error')


/**
 * Create an API method from the declared spec.
 *
 * @param [spec.method='GET'] Request Method (POST, GET, DELETE, PUT)
 * @param [spec.path=''] Path to be appended to the API BASE_PATH, joined with
 *  the instance's path (e.g. 'charges' or 'customers')
 * @param [spec.required=[]] Array of required arguments in the order that they
 *  must be passed by the consumer of the API. Subsequent optional arguments are
 *  optionally passed through a hash (Object) as the penultimate argument
 *  (preceeding the also-optional callback argument
 */
function eveMethod(spec: globals.Spec) {
	var commandPath = spec.path,
		requestMethod = (spec.method || 'GET').toUpperCase(),
		duration = spec.cacheDuration || 3600000,  // sets default duration at 1 hour
		securedResource = spec.secured;

	return (args?: any, callback?: (err: Error, data: any)=>any)=> {
		var self = this,
			cache = self._eve.getCache(),
			deferred = this.createDeferred(args, callback),
			options = {},
			requestPath: string = '',
			cacheKey: string = '',
			requestParams: string = '',
			auth: string = '';
			
		if (self.authParamProcessor) {
			auth = utils.stringifyRequestData(self.authParamProcessor(self, args, deferred))
		}

		if (self.requestParamProcessor) {
			requestParams = utils.stringifyRequestData(self.requestParamProcessor(args, deferred));
		}
		var apiVersion = self._eve.getApiField('version') || '';

		var headers: globals.Headers = {
			'Accept': 'application/xml',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': contentLength(auth),
			'User-Agent': self._eve.getUserAgent() || '',
			'Client-Version': apiVersion,
			'X-Client-User-Agent': 'EveAPI-node/' + self._eve.PACKAGE_VERSION + ' (jvnpackard@gmail.com)'
		};

		requestPath = this.createFullPath(commandPath, requestParams)

		cacheKey = (this.overrideHost || this._eve.getApiField('host')) + requestPath + auth

		function requestCallback(err: Error, response: any, isCached: boolean) {
			var resp: string, res: string;
			if (err) {
				deferred.reject(err);
			} else {
				if (isCached) {
					return deferred.resolve(response);
				} else {
					res = self._eve.transformAllResponses ? self._eve.transformAllResponses(response) : response
					resp = self.transformResponseData ? self.transformResponseData(res) : res;
					cache.write(cacheKey, JSON.stringify(resp), duration, function(err: Error, r: string) {
						if (err) return deferred.reject(err);
						return deferred.resolve(resp);
					})
				}
			}
		};

		cache.read(cacheKey, function(err: Error, data: any) {
			if (err) return requestCallback(err, null, false)
			if (data && typeof data === 'string') return requestCallback(null, JSON.parse(data), true)

			self._request(requestMethod, requestPath, auth, headers, requestCallback);

			return deferred.promise;
		})
	};
};

function contentLength(keyStr: string) {
	return keyStr ? keyStr.length : 0
}


module.exports = eveMethod;