import Resource = require('../EveResource');
import Error = require('../Error')
import utils = require('../utils')

class CharacterID extends Resource {
	public fetch: ((err: Error, data: any)=>void);
	constructor(eve: any) {
		super(eve)
		this.fetch =  this.method({
			method: 'GET',
			path: '/eve/CharacterID.xml.aspx',
			cacheDuration: 3600000		
		})
		this.requestParamProcessor = function(params: any, deferred: any): any {
			if(params && params.names && typeof params === 'object') {
				if(Array.isArray(params.names)) {
					return {names: params.names.join(',')}
				} else if(params.names && typeof params.names === 'string' && params.names != '') {
					return params
				}
			} else if (typeof params === 'string' && params != '') {
				return {names: params}
			} 
			deferred.reject(new Error.EveInvalidRequestError({message: "CharacterID requires an object with a names property or a string with the names separated by a comma."}))	
		};
	};
	
}

export = CharacterID