/* 
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
interface CurrencyCodeDetails { 
    id: string; 
    name: string;
    min_size: string;
}

interface CurrencyList {
    [id: string]: CurrencyCodeDetails
}

interface ConversionResult {
    base: string;
    currency: string;
    amount: string;
}

var supportedCurrenciesCache: CurrencyList;

function request(url: string): Promise<any> {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.status);
          }
        }
      }
      xhr.ontimeout = function () {
        reject('timeout');
      }
      xhr.open('get', url, true);
      xhr.setRequestHeader('CB-VERSION', '2017-08-07');
      xhr.send();
    })
  }

async function getSupportedCurrencies(): Promise<CurrencyList> {
    if (supportedCurrenciesCache) {
        return supportedCurrenciesCache;
    } else {
        let rawResponse = await request('https://api.coinbase.com/v2/currencies');
        try {
            let parsedResponse: {data: CurrencyCodeDetails[]} = JSON.parse(rawResponse);
            supportedCurrenciesCache = {};
            parsedResponse.data.forEach((value) => {
                supportedCurrenciesCache[value.id] = value;
            });
            console.log('Got this list of supported currencies: ', supportedCurrenciesCache);
            return supportedCurrenciesCache;
        } catch (e) {
            console.error('Could not get the list of supported currencies from Coinbase! Error was: ' + e);
        }
    }
}

async function convertCurrency(from: string, to: string) {
    let supportedCurrencies = await getSupportedCurrencies();
    if (from in supportedCurrencies && to in supportedCurrencies) {
        try {
            let rawResponse = await request(`https://api.coinbase.com/v2/prices/${from}-${to}/spot`);
            let parsedResponse: {data: ConversionResult} = JSON.parse(rawResponse);
            console.log(parsedResponse);
            return parsedResponse.data.currency;
        } catch (e) {
            console.error('Couldnt convert the currencies. Error was: ' + e);
        }
    } else {
        console.error('Currency not supported!');
    }
}

Office.initialize = function(reason){
    // Define the Contoso prefix.
    Excel.Script.CustomFunctions = {};
    Excel.Script.CustomFunctions["COINBASE"] = {};

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
                description: "The code of the currency whose price you want to check. (default: BTC)",
                valueType: Excel.CustomFunctionValueType.number,
                valueDimensionality: Excel.CustomFunctionDimensionality.scalar
            },
            {
                name: "Currency",
                description: "The code of the currency in which you want to display the price. (default: USD)",
                valueType: Excel.CustomFunctionValueType.number,
                valueDimensionality: Excel.CustomFunctionDimensionality.scalar
            }
        ],
        options: {batch: false, stream: false}
    };
    
function getPrice(base: string, currency: string) {
    return new OfficeExtension.Promise(async (setResult, setError) => {
        try {
            let result = await convertCurrency(base, currency);
            setResult(result);
        } catch (e) {
            setError(e);
        }
    });
}

Excel.run(function (context: Excel.RequestContext) {        
    context.workbook.customFunctions.addAll();
    return context.sync().then(function(){});
}).catch(function(error){});







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