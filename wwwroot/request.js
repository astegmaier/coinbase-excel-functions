function request(url) {
    return new OfficeExtension.Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
                else {
                    reject(xhr.status);
                }
            }
        };
        xhr.ontimeout = function () {
            reject('timeout');
        };
        xhr.open('get', url, true);
        xhr.setRequestHeader('CB-VERSION', '2017-08-07');
        xhr.send();
    });
}
//# sourceMappingURL=request.js.map