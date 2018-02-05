var supportedCurrenciesCache;
var supportedGDAXProductsCache;
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
        xhr.send();
    });
}
//Gets supported currencies from Coinbase.
function getSupportedCurrencies() {
    return new OfficeExtension.Promise(function (resolve, reject) {
        if (supportedCurrenciesCache) {
            resolve(supportedCurrenciesCache);
        }
        else {
            request('https://api.coinbase.com/v2/currencies')
                .then(function (rawResponse) {
                var parsedResponse = JSON.parse(rawResponse);
                supportedCurrenciesCache = {};
                parsedResponse.data.forEach(function (value) {
                    supportedCurrenciesCache[value.id] = value;
                });
                //For some reason, this list is missing Etherium and Litecoin, so you have to add it manually.
                supportedCurrenciesCache["ETH"] = { id: "ETH", name: "Etherium" };
                supportedCurrenciesCache["LTC"] = { id: "LTC", name: "Litecoin" };
                console.log('Got this list of supported currencies: ', supportedCurrenciesCache);
                resolve(supportedCurrenciesCache);
            })
                .catch(function () {
                reject('Could not get the list of supported currencies from Coinbase!');
            });
        }
    });
}
function getPrice(base, currency) {
    return new OfficeExtension.Promise(function (setResult, setError) {
        getSupportedCurrencies()
            .then(function (supportedCurrencies) {
            if (supportedCurrencies.hasOwnProperty(base) && supportedCurrencies.hasOwnProperty(currency)) {
                request("https://api.coinbase.com/v2/prices/" + base + "-" + currency + "/spot")
                    .then(function (rawResponse) {
                    var parsedResponse = JSON.parse(rawResponse);
                    setResult(parseFloat(parsedResponse.data.amount));
                })
                    .catch(function () { return setError('#VALUE'); }); //setError("Couldn't convert currencies"));
            }
            else {
                setError('#VALUE'); //setError("Currency not supported");
            }
        })
            .catch(function () { return setError('#VALUE'); }); //setError("Couldn't get list of supported currencies"));
    });
}
//Gets supported products from GDAX
function getSupportedProducts() {
    return new OfficeExtension.Promise(function (resolve, reject) {
        if (supportedGDAXProductsCache) {
            resolve(supportedGDAXProductsCache);
        }
        else {
            request('https://api.gdax.com/products')
                .then(function (rawResponse) {
                var parsedResponse = JSON.parse(rawResponse);
                supportedGDAXProductsCache = {};
                parsedResponse.forEach(function (value) {
                    supportedGDAXProductsCache[value.id] = value;
                });
                console.log('Got this list of supported GDAX products: ', supportedGDAXProductsCache);
                resolve(supportedGDAXProductsCache);
            })
                .catch(function () {
                reject('Could not get the list of supported currencies from GDAX!');
            });
        }
    });
}
function getGDAXPrice(base, currency) {
    return new OfficeExtension.Promise(function (setResult, setError) {
        getSupportedProducts()
            .then(function (supportedProducts) {
            var productName = base + '-' + currency;
            if (productName in supportedProducts) {
                request("https://api.gdax.com/products/" + productName + "/book/")
                    .then(function (rawResponse) {
                    var parsedResponse = JSON.parse(rawResponse);
                    var bidPrice = parseFloat(parsedResponse.bids[0][0]);
                    var askPrice = parseFloat(parsedResponse.asks[0][0]);
                    var midMarketPrice = (bidPrice + askPrice) / 2;
                    setResult(midMarketPrice);
                })
                    .catch(function () { return setError('#VALUE'); }); //setError("Find a book for that product"));
            }
            else {
                setError('#VALUE'); //setError("Product not supported");
            }
        })
            .catch(function () { return setError('#VALUE'); }); //setError("Couldn't get list of supported products"));
    });
}
Office.initialize = function (reason) {
    Excel.Script.CustomFunctions = {};
    Excel.Script.CustomFunctions["COINBASE"] = {};
    Excel.Script.CustomFunctions["GDAX"] = {};
    Excel.Script.CustomFunctions["COINBASE"]["PRICE"] = {
        call: getPrice,
        description: "Gets the current bitcoin price from Coinbase",
        result: {
            resultType: Excel.CustomFunctionValueType.number,
            resultDimensionality: Excel.CustomFunctionDimensionality.scalar
        },
        parameters: [
            {
                name: "Base",
                description: "The code of the currency whose price you want to check. (Example: 'BTC')",
                valueType: Excel.CustomFunctionValueType.string,
                valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
            },
            {
                name: "Currency",
                description: "The code of the currency in which you want to display the price. (Example: 'USD')",
                valueType: Excel.CustomFunctionValueType.string,
                valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
            }
        ],
        options: { batch: false, stream: false }
    };
    Excel.Script.CustomFunctions["GDAX"]["PRICE"] = {
        call: getGDAXPrice,
        description: "Gets the current bitcoin mid-market price from GDAX",
        result: {
            resultType: Excel.CustomFunctionValueType.number,
            resultDimensionality: Excel.CustomFunctionDimensionality.scalar
        },
        parameters: [
            {
                name: "Base",
                description: "The code of the currency whose price you want to check. (Example: 'BTC')",
                valueType: Excel.CustomFunctionValueType.string,
                valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
            },
            {
                name: "Currency",
                description: "The code of the currency in which you want to display the price. (Example: 'USD')",
                valueType: Excel.CustomFunctionValueType.string,
                valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
            }
        ],
        options: { batch: false, stream: false }
    };
    Excel.run(function (context) {
        context.workbook.customFunctions.addAll();
        return context.sync().then(function () { });
    }).catch(function (error) { });
};
//# sourceMappingURL=customfunctions.js.map