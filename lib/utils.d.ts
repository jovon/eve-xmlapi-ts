import globals = require('../globals');
export = utils;
declare var utils: {
    isKeyHash: (o: any) => any;
    isObject: (o: any) => boolean;
    formatRequestParams(self: any, data: any, deferred: any): any;
    keyObjToStr(self: any, arg: any, deferred: any): any;
    stringifyRequestData: (data: any) => string;
    getDataFromArgs: (args: any) => any;
    getKeyFromArgs: (args: any) => globals.EveKey;
    protoExtend: (sub: any) => any;
};
