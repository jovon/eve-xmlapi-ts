import qs = require('qs');
import _ = require('lodash');

var hasOwn = {}.hasOwnProperty;
var toString = {}.toString;

var utils = module.exports = {

  isKeyHash: function(o: EveKey) {
    return _.isPlainObject(o) && o.hasOwnProperty('keyID') && o.hasOwnProperty('vCode')
  },

  isObject: function(o: any) {
    return _.isPlainObject(o);
  },
  
  formatRequestParams(self: any, method: string, data: any, headers: any, deferred: any) {
    var requestParams: any;    
    if (self.requestParamProcessor) {
      requestParams = self.requestParamProcessor(method, data, headers);      
      if(requestParams instanceof Error) {
        return deferred.reject(requestParams)
      }      
    } else {
      return this.stringifyRequestData(data || {});
    }
    return requestParams    
  },

  /**
   * Stringifies an Object, accommodating nested objects
   * (forming the conventional key 'parent[child]=value')
   */
  stringifyRequestData: function(data: any) {
    return qs.stringify(data, {arrayFormat: 'brackets'});
  },

  
  /**
   * Return the data argument from a list of arguments.
   * Removes the keyid and vcode from the arguments then
   * returns the rest of the parameters.
   */
  getDataFromArgs: function(args: any) {
    var arg = args[0];
    if (utils.isKeyHash(arg)) {
      delete arg['keyID']
      delete arg['vCode']
    }
    return arg
  },

  /**
   * Return the options hash from a list of arguments
   */
  getKeyFromArgs: function(args: any): EveKey{
    var key: EveKey = {
      keyID: '',
      vCode: '',
    }
    
    var arg = args[0];
    if (utils.isKeyHash(arg)) {      
       key.keyID = arg.keyID
       key.vCode = arg.vCode 
    }    
    return key;
  },

  /**
   * Provide simple "Class" extension mechanism
   */
  protoExtend: function(sub: any) {
    var Super = this;
    var Constructor = hasOwn.call(sub, 'constructor') ? sub.constructor : function() {
      Super.apply(this, arguments);
    };
    Constructor.prototype = Object.create(Super.prototype);
    for (var i in sub) {
      if (hasOwn.call(sub, i)) {
        Constructor.prototype[i] = sub[i];
      }
    }
    for (i in Super) {
      if (hasOwn.call(Super, i)) {
        Constructor[i] = Super[i];
      }
    }
    return Constructor;
  },

};