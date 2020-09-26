import secrets from "../secrets/secrets";

const dashboardApi = {
	get: get,
	post: post
};

const url = `http://${secrets.PUBLIC_IP}:8080/`;

function get(request) {
	return new Promise((resolve, reject) => {
		const HttpClient = function() {
			this.get = (url) => {
				let httpRequest = new XMLHttpRequest();
				httpRequest.open("GET", url + request || '', true);
				httpRequest.onreadystatechange = () => {
					if (httpRequest.readyState === 4 && httpRequest.status === 200) {
						resolve(
							JSON.parse(httpRequest.responseText)
						);
					}
					else if (httpRequest.status >= 400) {
						debugger;
						reject(new Error(httpRequest.statusText + ': ' + request));
					}
				};
				httpRequest.send();
			};
		};

		const req = new HttpClient();
		req.get(url);
	});
}

function post(request, body) {
	return new Promise((resolve, reject) => {
		const HttpClient = function() {
			this.post = (url, body) => {
				let httpRequest = new XMLHttpRequest();
				httpRequest.open("POST", url + request || '', true);
				httpRequest.setRequestHeader('Content-Type', 'application/json');
				httpRequest.onreadystatechange = () => {
					if (httpRequest.readyState === 4 && httpRequest.status === 200) {
						resolve(
							JSON.parse(httpRequest.responseText)
						);
					}
					else if (httpRequest.status >= 400) {
						reject(new Error(httpRequest.statusText + ': ' + request));
					}
				};
				httpRequest.send(body);
			};
		};
		const req = new HttpClient();
		req.post(url, body);
	});
}

export default dashboardApi;
