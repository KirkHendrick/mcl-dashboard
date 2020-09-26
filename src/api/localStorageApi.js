const LOCAL_KEY = 'dashboard';

const localStorageApi = {
	get: get,
	set: set,
};

function get(key) {
	let ls = {};
	if(global.localStorage) {
		try {
			ls = JSON.parse(global.localStorage.getItem(LOCAL_KEY)) || {}
		}
		catch(e) {}
	}
	return ls[key];
}

function set(key, value) {
	if(global.localStorage) {
		global.localStorage.setItem(
			LOCAL_KEY,
			JSON.stringify({
				[key]: value
			})
		);
	}

}

export default localStorageApi;