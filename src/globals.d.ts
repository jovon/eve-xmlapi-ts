
declare module globals {
	export interface Options {
		protocol?: string;
		host?: string;
		hostname?: string;
		family?: number;
		port?: number
		localAddress?: string;
		socketPath?: string;
		method?: string;
		path?: string;
		headers?: Headers;
		auth?: string;
		agent?: any;
	}

	export interface Headers {
		'Accept': string;
		'Content-Type': string;
		'Content-Length': number;
		'User-Agent': string;
		'Client-Version': string;
		'X-Client-User-Agent': string;
		[key: string]: any
	}

	export interface Api {
		auth?: string;
		host: string;
		basePath: string;
		version: string;
		timeout: number;
		port: string;
		protocol: string;
		agent?: any;
		dev?: boolean;
		[key: string]: any;
	}

	export interface Spec {
		method: string;
		path: string;
		cacheDuration: number;
		secured?: boolean;
	}

	export interface EveKey {
		keyID: string;
		vCode: string;
	}

		
	export interface Params {
		keyID?: string;
		vCode?: string;
		characterID?: (string | number);
		flat?: boolean;
		eventIDs?: (string | number)[];
		contractID?: (string | number);
		orderID?: (string | number);
		accountKey?: (string | number);
		fromID?: (string | number);
		rowCount?: (string | number);
		version?: (string | number);
		ids?: any;
		names?: any;
	}
}
export = globals