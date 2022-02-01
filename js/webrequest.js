/*
WebRequest - XMLHttpRequest wrapper using promised and ES6 OOP
GET Usage:
	var req = new WebRequest('get','http://my.site/page.html');
	
POST Usage (data argument can be URL encoded string also):
	var req = new WebRequest('post','http://my.site/page.html',{
		name : 'bob',
		age : 43
	});
	
Retrieving the response:
	req.response.then(resp => {
		Object.keys(resp.headers).forEach(x =>
			console.log(x + ': ' + resp.headers[x] + '\n');
		});
		console.log(resp.body);
	}).catch(resp => {
		console.log(resp.status + ' - ' + resp.body);
	});
	
Streamlined execution:
	(new WebRequest('get','http://my.site/page.html')).response.then(resp =>
		console.log(resp.body);
	});
*/

class WebRequest {
	constructor(method,url,data) {
		this.method = method;
        this.url = url;
        this.data = (data) ? data : false;
		
		this.xhr = new XMLHttpRequest();
		this.xhr.open(this.method,this.url);
        
		this.response = new Promise((success,error) => {
			this.xhr.onload = () => {
				success({
					'status' : this.xhr.status,
					'headers' : () => {
						var returnValue = {};
						this.xhr.getAllResponseHeaders().split('\n').filter(x => x.length > 0).forEach(x => {
							var key = x.replace(/^([^:]+):.*$/,"$1");
							var value = x.replace(/^[^:]+:[ \t]*(.*)$/,"$1");
							returnValue[key] = value;
						});
						return returnValue;
					},
					'body' : this.xhr.responseText
				});
			};
			
			this.xhr.onerror = () => {
				error({
						'status' : this.xhr.status,
						'body' : this.xhr.statusText
					});
			};
		});
		
		if (this.data)
			this.xhr.send(this.data);
		else
			this.xhr.send();
    }
}
