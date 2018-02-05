var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var testSupportedCurrenciesCache;
var testSupportedGDAXProductsCache;
function testRequest(url) {
    return new Promise(function (resolve, reject) {
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
function testGetSupportedCurrencies() {
    return __awaiter(this, void 0, void 0, function () {
        var rawResponse, parsedResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!testSupportedCurrenciesCache) return [3 /*break*/, 1];
                    return [2 /*return*/, testSupportedCurrenciesCache];
                case 1: return [4 /*yield*/, testRequest('https://api.coinbase.com/v2/currencies')];
                case 2:
                    rawResponse = _a.sent();
                    try {
                        parsedResponse = JSON.parse(rawResponse);
                        testSupportedCurrenciesCache = {};
                        parsedResponse.data.forEach(function (value) {
                            testSupportedCurrenciesCache[value.id] = value;
                        });
                        console.log('Got this list of supported currencies: ', testSupportedCurrenciesCache);
                        return [2 /*return*/, testSupportedCurrenciesCache];
                    }
                    catch (e) {
                        console.error('Could not get the list of supported currencies from Coinbase! Error was: ' + e);
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testConvertCurrency(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var supportedCurrencies, rawResponse, parsedResponse, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testGetSupportedCurrencies()];
                case 1:
                    supportedCurrencies = _a.sent();
                    if (!(from in supportedCurrencies && to in supportedCurrencies)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, testRequest("https://api.coinbase.com/v2/prices/" + from + "-" + to + "/spot")];
                case 3:
                    rawResponse = _a.sent();
                    parsedResponse = JSON.parse(rawResponse);
                    console.log(parsedResponse);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error('Couldnt convert the currencies. Error was: ' + e_1);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    console.error('Currency not supported!');
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function testGetSupportedGDAXProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var rawResponse, parsedResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!testSupportedGDAXProductsCache) return [3 /*break*/, 1];
                    return [2 /*return*/, testSupportedGDAXProductsCache];
                case 1: return [4 /*yield*/, testRequest('https://api.gdax.com/products/')];
                case 2:
                    rawResponse = _a.sent();
                    try {
                        parsedResponse = JSON.parse(rawResponse);
                        testSupportedGDAXProductsCache = {};
                        parsedResponse.forEach(function (value) {
                            testSupportedGDAXProductsCache[value.id] = value;
                        });
                        console.log('Got this list of supported GDAX products: ', testSupportedGDAXProductsCache);
                        return [2 /*return*/, testSupportedGDAXProductsCache];
                    }
                    catch (e) {
                        console.error('Could not get the list of supported currencies from GDAX! Error was: ' + e);
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testGdaxPrices(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var supportedProducts, productName, rawResponse, parsedResponse, bidPrice, askPrice, midMarketPrice, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testGetSupportedGDAXProducts()];
                case 1:
                    supportedProducts = _a.sent();
                    productName = from + '-' + to;
                    if (!(productName in supportedProducts)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, testRequest("https://api.gdax.com/products/" + productName + "/book/")];
                case 3:
                    rawResponse = _a.sent();
                    parsedResponse = JSON.parse(rawResponse);
                    bidPrice = parseFloat(parsedResponse.bids[0][0]);
                    askPrice = parseFloat(parsedResponse.asks[0][0]);
                    midMarketPrice = (bidPrice + askPrice) / 2;
                    console.log(midMarketPrice);
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.error('Couldnt look up the GDAX product. Error was: ' + e_2);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    console.error('Product not supported!');
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=test.js.map