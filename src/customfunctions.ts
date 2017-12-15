interface CurrencyCodeDetails { 
    id: string; 
    name: string;
    min_size?: string;
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

function request(url: string): OfficeExtension.Promise<any> {
    return new OfficeExtension.Promise(function(resolve, reject) {
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

function getSupportedCurrencies(): OfficeExtension.Promise<CurrencyList> {
    return new OfficeExtension.Promise(function(resolve, reject) {
        if (supportedCurrenciesCache) {
            resolve(supportedCurrenciesCache);
        } else {
            request('https://api.coinbase.com/v2/currencies')
                .then(rawResponse => {
                    let parsedResponse: {data: CurrencyCodeDetails[]} = JSON.parse(rawResponse);
                    supportedCurrenciesCache = {};
                    parsedResponse.data.forEach((value) => {
                        supportedCurrenciesCache[value.id] = value;
                    });
                    //For some reason, this list is missing Etherium and Litecoin, so you have to add it manually.
                    supportedCurrenciesCache["ETH"] = {id: "ETH", name: "Etherium"};
                    supportedCurrenciesCache["LTC"] = {id: "LTC", name: "Litecoin"};
                    console.log('Got this list of supported currencies: ', supportedCurrenciesCache);
                    resolve(supportedCurrenciesCache);
                })
                .catch(() => {
                    reject('Could not get the list of supported currencies from Coinbase!');
                });
        }
    });
}

function getPrice(base: string, currency: string) {
    return new OfficeExtension.Promise((setResult, setError) => {
        getSupportedCurrencies()
            .then((supportedCurrencies) => {
                if ( supportedCurrencies.hasOwnProperty(base) && supportedCurrencies.hasOwnProperty(currency)) {
                    request(`https://api.coinbase.com/v2/prices/${base}-${currency}/spot`)
                        .then(rawResponse => {
                            let parsedResponse: {data: ConversionResult} = JSON.parse(rawResponse);
                            setResult(parseFloat(parsedResponse.data.amount));
                        })
                        .catch(() => setError('#VALUE'));//setError("Couldn't convert currencies"));
                } else {
                    setError('#VALUE'); //setError("Currency not supported");
                }
            })
            .catch(() => setError('#VALUE'));//setError("Couldn't get list of supported currencies"));
    });
}

Office.initialize = function(reason){
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
        options: {batch: false, stream: false}
    };
    
    Excel.run(function (context: Excel.RequestContext) {        
        context.workbook.customFunctions.addAll();
        return context.sync().then(function(){});
    }).catch(function(error){});
}; 