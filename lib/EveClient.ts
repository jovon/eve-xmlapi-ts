import utils = require('./utils')
import globals = require('../globals')

var exec = require('child_process').exec,
    DEFAULT_HOST = 'api.eveonline.com',
    DEFAULT_BASE_PATH = '',
    DEFAULT_API_VERSION = '2',
    DEFAULT_PORT = '443',
    DEFAULT_PROTOCOL = 'https',
    DEFAULT_TIMEOUT = require('http').createServer().timeout;

var resources: Resources = {
  CallList: require('./resources/CallList'),
  SkillQueue: require('./resources/SkillQueue'),
  CharacterID: require('./resources/CharacterID'),
  ServerStatus: require('./resources/ServerStatus'),
  Characters: require('./resources/Characters')
}


interface Resources {
  [key: string]: any
}

class EveClient implements globals.Client{
    _api: globals.Api;
    EveResource: any;
    cache: any;
    private _cache: any;
    
    PACKAGE_VERSION: any;
    private USER_AGENT: any;
    [key: string]: any;
    constructor() {        
      if (!(this instanceof EveClient)) {
        return new EveClient();
      }
      
      this._api = {
        auth: null,
        host: DEFAULT_HOST,
        basePath: DEFAULT_BASE_PATH,
        version: '',
        timeout: DEFAULT_TIMEOUT,
        port: DEFAULT_PORT,
        protocol: DEFAULT_PROTOCOL,
        agent: null,
        dev: true,
      };  
      
      this.EveResource = require('./EveResource')  
      
      this.cache = {}  
      this.cache.Cache = require('./cache/cache')
      this.cache.MemoryCache = require('./cache/memory')
      this.cache.FileCache = require('./cache/file')
      this.cache.RedisCache = require('./cache/redis')
      this._cache = new this.cache.MemoryCache()    
          
      var version: string;        
      
      var packageJson = require('../package.json')
      this.PACKAGE_VERSION = packageJson.version;
      
      this.USER_AGENT = null
      
      this._prepResources()
    }  
    
  
    setHost(host: string, port?: string, protocol?: string) {
      this._setApiField('host', host);
      if (port) {
        this.setPort(port);
      }
      if (protocol) {
        this.setProtocol(protocol);
      }
    };
    
    setPort(port: string) {
      this._setApiField('port', port.toLowerCase());
    };
  
    setProtocol(protocol: string) {
      this._setApiField('protocol', protocol.toLowerCase());
    };
  
    setApiVersion(version: string) {
      if (version) {
        this._setApiField('version', version);
      }
    };
    
    setCache(cacheType: string, options?: any) {
      if(cacheType) {
        switch (cacheType.toLowerCase()) {
          case 'file':
            this._cache = new this.cache.FileCache(options)
            break;
          case 'redis':
            this._cache = new this.cache.RedisCache(options)
            break;
          default:
            this._cache = new this.cache.MemoryCache()        
        }
      } else {
        throw Error('Missing cache type string')
      }
    };
    
    getCache() {
      return this._cache
    };
    
    // @param  {Object}   key   Eve Apikey with vCode and keyID properties
    setApiKey(key: any) {
      if (key) {      
          this._setApiField('keyID', key.keyID || key.keyid);     
          this._setApiField('vCode', key.vCode || key.vcode);      
      }
    };
    
    getApiKey(args: any): globals.EveKey {
      var keyid = this.getApiField('keyID') || args.keyID || args.keyid,
          vcode = this.getApiField('vCode') || args.vCode || args.vcode
      
      if(keyid && keyid != '' && vcode && vcode != '') {
        return {keyID: keyid, vCode: vcode}
      }
      return null
    };
  
    setTimeout(timeout: number) {
      var self = this
      this._setApiField(
        'timeout',
        timeout == null ? DEFAULT_TIMEOUT : timeout
      );
    };
  
    setHttpAgent(agent: any) {
      this._setApiField('agent', agent);
    };
  
    _setApiField(key: string, value: any) {
      this._api[key] = value;
    };
  
    getApiField(key: string) {
      return this._api[key];
    };
    
    getUserAgent(cb: (cua: string)=>void) {
      var self = this;
      if(this.USER_AGENT) {
        return cb(JSON.stringify(self.USER_AGENT))
      }
      // If the UserAgent isn't set then grab some info on the local system. 
      exec('uname -a', function(err: Error, uname: string) {
        self.USER_AGENT = uname || 'UNKNOWN';
        cb(JSON.stringify(self.USER_AGENT));
      });
    };
    
    setUserAgent(ua: any) {
      this.USER_AGENT = ua;
    };
  
    /*  
    * Make the first letter of the resource lowercase for the method
    */
    _prepResources() {
      for (var name in resources) {
        var resourceMethod: string = name[0].toLowerCase() + name.substring(1)  // (i.e. change ServerStatus to serverStatus)
        this[resourceMethod] = new resources[name](this);                       // make the resource a method on EveClient
      }
    };
  
  };

module.exports = new EveClient();