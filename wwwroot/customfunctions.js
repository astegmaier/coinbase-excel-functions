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
var supportedCurrenciesCache;
function request(url) {
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
        xhr.setRequestHeader('CB-VERSION', '2017-08-07');
        xhr.send();
    });
}
function getSupportedCurrencies() {
    return __awaiter(this, void 0, void 0, function () {
        var rawResponse, parsedResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!supportedCurrenciesCache) return [3 /*break*/, 1];
                    return [2 /*return*/, supportedCurrenciesCache];
                case 1: return [4 /*yield*/, request('https://api.coinbase.com/v2/currencies')];
                case 2:
                    rawResponse = _a.sent();
                    try {
                        parsedResponse = JSON.parse(rawResponse);
                        supportedCurrenciesCache = {};
                        parsedResponse.data.forEach(function (value) {
                            supportedCurrenciesCache[value.id] = value;
                        });
                        console.log('Got this list of supported currencies: ', supportedCurrenciesCache);
                        return [2 /*return*/, supportedCurrenciesCache];
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
function convertCurrencyOld(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var supportedCurrencies, rawResponse, parsedResponse, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSupportedCurrencies()];
                case 1:
                    supportedCurrencies = _a.sent();
                    if (!(from in supportedCurrencies && to in supportedCurrencies)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, request("https://api.coinbase.com/v2/prices/" + from + "-" + to + "/spot")];
                case 3:
                    rawResponse = _a.sent();
                    parsedResponse = JSON.parse(rawResponse);
                    console.log(parsedResponse);
                    return [2 /*return*/, parsedResponse.data.currency];
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
function convertCurrency(from, to) {
    var _this = this;
    return new OfficeExtension.Promise(function (setResult, setError) { return __awaiter(_this, void 0, void 0, function () {
        var supportedCurrencies, rawResponse, parsedResponse, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSupportedCurrencies()];
                case 1:
                    supportedCurrencies = _a.sent();
                    if (!(from in supportedCurrencies && to in supportedCurrencies)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, request("https://api.coinbase.com/v2/prices/" + from + "-" + to + "/spot")];
                case 3:
                    rawResponse = _a.sent();
                    parsedResponse = JSON.parse(rawResponse);
                    console.log(parsedResponse);
                    setResult(parsedResponse.data.currency);
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.error('Couldnt convert the currencies. Error was: ' + e_2);
                    setError('Couldnt convert the currencies!');
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    console.error('Currency not supported!');
                    setError('Currency not supported!');
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); });
}
Office.initialize = function (reason) {
    // Define the Contoso prefix.
    Excel.Script.CustomFunctions = {};
    Excel.Script.CustomFunctions["COINBASE"] = {};
    Excel.Script.CustomFunctions["COINBASE"]["PRICE"] = {
        call: convertCurrency,
        description: "Gets the current bitcoin price from Coinbase",
        result: {
            resultType: Excel.CustomFunctionValueType.number,
            resultDimensionality: Excel.CustomFunctionDimensionality.scalar
        },
        parameters: [
            {
                name: "Base",
                description: "The code of the currency whose price you want to check. (default: BTC)",
                valueType: Excel.CustomFunctionValueType.string,
                valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
            },
            {
                name: "Currency",
                description: "The code of the currency in which you want to display the price. (default: USD)",
                valueType: Excel.CustomFunctionValueType.string,
                valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
            }
        ],
        options: { batch: false, stream: false }
    };
    function getPrice(base, currency) {
        var _this = this;
        return new OfficeExtension.Promise(function (setResult, setError) { return __awaiter(_this, void 0, void 0, function () {
            var result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, convertCurrency(base, currency)];
                    case 1:
                        result = _a.sent();
                        setResult(result);
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        setError(e_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    }
    Excel.run(function (context) {
        context.workbook.customFunctions.addAll();
        return context.sync().then(function () { });
    }).catch(function (error) { });
    // Excel.Script.CustomFunctions["CONTOSO"] = {};
    // // add42 is an example of a synchronous function.
    // function add42 (a: number, b: number) {
    //     return a + b + 42;
    // }
    // Excel.Script.CustomFunctions["CONTOSO"]["ADD42"] = {
    //     call: add42,
    //     description: "Finds the sum of two numbers and 42.",
    //     helpUrl: "https://www.contoso.com/help.html",
    //     result: {
    //         resultType: Excel.CustomFunctionValueType.number,
    //         resultDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //     },
    //     parameters: [
    //         {
    //             name: "num 1",
    //             description: "The first number",
    //             valueType: Excel.CustomFunctionValueType.number,
    //             valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //         },
    //         {
    //             name: "num 2",
    //             description: "The second number",
    //             valueType: Excel.CustomFunctionValueType.number,
    //             valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //         }
    //     ],
    //     options:{ batch: false, stream: false }
    // };
    // // getTemperature is an example of an asynchronous function.
    // function getTemperature(thermometerID: string){
    //     return new OfficeExtension.Promise(function(setResult, setError){
    //         sendWebRequestExample(thermometerID, function(data){
    //             setResult(data.temperature);
    //         });
    //     });
    // }
    // Excel.Script.CustomFunctions["CONTOSO"]["GETTEMPERATURE"] = {
    //     call: getTemperature,
    //     description: "Returns the temperature of a sensor.",
    //     helpUrl: "https://www.contoso.com/help.html",
    //     result: {
    //         resultType: Excel.CustomFunctionValueType.number,
    //         resultDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //     },
    //     parameters: [
    //         {
    //             name: "thermometer ID",
    //             description: "The ID of the thermometer to read.",
    //             valueType: Excel.CustomFunctionValueType.string,
    //             valueDimensionality: Excel.CustomFunctionDimensionality.scalar
    //         },
    //     ],
    //     options: { batch: false,  stream: false }
    // };
    // // incrementValue is an example of a streaming function.
    // function incrementValue(increment: any, setResult: any){    
    // 	var result = 0;
    //     setInterval(function(){
    //         result += increment;
    //         setResult(result);
    //     }, 1000);
    // }
    // Excel.Script.CustomFunctions["CONTOSO"]["INCREMENTVALUE"] = {
    //     call: incrementValue,
    //     description: "Increments a counter that starts at zero.",
    //     helpUrl: "https://www.contoso.com/help.html",
    //     result: {
    //         resultType: Excel.CustomFunctionValueType.number,
    //         resultDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //     },
    //     parameters: [
    //         {
    //             name: "period",
    //             description: "The time between updates, in milliseconds.",
    //             valueType: Excel.CustomFunctionValueType.number,
    //             valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //         },
    //     ],
    //     options: { batch: false,  stream: true }
    // };
    // // The refreshTemperature and streamTemperature functions use global variables to save & read state, while streaming data.
    // var savedTemperatures: any = {};
    // function refreshTemperature(thermometerID: any){        
    //     sendWebRequestExample(thermometerID, function(data){
    //         savedTemperatures[thermometerID] = data.temperature;
    //     });
    //     setTimeout(function(){
    //         refreshTemperature(thermometerID);
    //     }, 1000);
    // }
    // function streamTemperature(thermometerID: any, setResult: any){    
    //     if(!savedTemperatures[thermometerID]){
    //         refreshTemperature(thermometerID);
    //     }
    //     function getNextTemperature(){
    //         setResult(savedTemperatures[thermometerID]);
    //         setTimeout(getNextTemperature, 1000);
    //     }
    //     getNextTemperature();
    // }
    // Excel.Script.CustomFunctions["CONTOSO"]["STREAMTEMPERATURE"] = {
    //     call: streamTemperature,
    //     description: "Updates the displayed temperature of the sensor in the Excel UI every second.",
    //     helpUrl: "https://www.contoso.com/help.html",
    //     result: {
    //         resultType: Excel.CustomFunctionValueType.number,
    //         resultDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //     },
    //     parameters: [
    //         {
    //             name: "thermometer ID",
    //             description: "The ID of the thermometer to read.",
    //             valueType: Excel.CustomFunctionValueType.string,
    //             valueDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //         },
    //     ],
    //     options: { batch: false,  stream: true }
    // };
    // // secondHighestTemp is a function that accepts and uses a range of data. The range is sent to the function as a parameter.
    // function secondHighestTemp(temperatures: any){ 
    //     var highest = -273, secondHighest = -273;
    //     for(var i = 0; i < temperatures.length;i++){
    //         for(var j = 0; j < temperatures[i].length;j++){
    //             if(temperatures[i][j] >= highest){
    //                 secondHighest = highest;
    //                 highest = temperatures[i][j];
    //             }
    //             else if(temperatures[i][j] >= secondHighest){
    //                 secondHighest = temperatures[i][j];
    //             }
    //         }
    //     }
    //     return secondHighest;
    // }
    // Excel.Script.CustomFunctions["CONTOSO"]["SECONDHIGHESTTEMP"] = {
    //     call: secondHighestTemp,
    //     description: "Returns the second highest tempature in the supplied range of temperatures.",
    //     helpUrl: "https://www.contoso.com/help.html",
    //     result: {
    //         resultType: Excel.CustomFunctionValueType.number,
    //         resultDimensionality: Excel.CustomFunctionDimensionality.scalar,
    //     },
    //     parameters: [
    //         {
    //             name: "temps",
    //             description: "The range of temperatures to compare.",
    //             valueType: Excel.CustomFunctionValueType.number,
    //             valueDimensionality: Excel.CustomFunctionDimensionality.matrix,
    //         },
    //     ],
    //     options: { batch: false, stream: false }
    // };
    // Register all the custom functions previously defined in Excel.
    // // The following are helper functions.
    // // sendWebRequestExample is intended to simulate a web request to read a temperature. The code in this function does not actually make a web request. 
    // function sendWebRequestExample(input: any, callback: (data: any) => void){
    //     var result: any = {};
    //     // Generate a temperature.
    //     result["temperature"] = 42 - (Math.random() * 10);
    //     setTimeout(function(){
    //         callback(result);
    //     }, 250);
    // }
    // // The log function lets you write debugging messages into Excel (first evaluate the MY.DEBUG function in Excel). You can also debug with regular debugging tools like Visual Studio.
    // var debug: string[][] = [];
    // var debugUpdate = function(data: any){};
    // function log(myText: string){
    //     debug.push([myText]);
    //     debugUpdate(debug);
    // }
    // function myDebug(setResult: any){
    //     debugUpdate = setResult;
    // }
};
//# sourceMappingURL=customfunctions.js.map