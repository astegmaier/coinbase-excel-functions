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

interface GDAXProduct {
    id: string;
    base_currency: string;
    quote_currency: string;
    base_min_size: string;
    base_max_size: string;
    quote_increment: string;
    display_name: string;
    status: string;
    margin_enabled: boolean
    status_message: string | null
    min_market_funds: string;
    max_market_funds: string;
    post_only: boolean;
    limit_only: boolean;
    cancel_only: boolean;
}
interface GDAXProductsList {
    [id: string]: GDAXProduct
}

interface GDAXBook {
    sequence: number;
    bids: (string | number)[][];
    asks: (string | number)[][];
}

var supportedCurrenciesCache: CurrencyList;
var supportedGDAXProductsCache: GDAXProductsList;

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
      xhr.send();
    })
  }

//Gets supported currencies from Coinbase.
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

//Gets supported products from GDAX
function getSupportedProducts(): OfficeExtension.Promise<GDAXProductsList> {
    return new OfficeExtension.Promise(function(resolve, reject) {
        if (supportedGDAXProductsCache) {
            resolve(supportedGDAXProductsCache);
        } else {
            request('https://api.gdax.com/products')
                .then(rawResponse => {
                    let parsedResponse: GDAXProduct[] = JSON.parse(rawResponse);
                    supportedGDAXProductsCache = {};
                    parsedResponse.forEach((value) => {
                        supportedGDAXProductsCache[value.id] = value;
                    });
                    console.log('Got this list of supported GDAX products: ', supportedGDAXProductsCache);
                    resolve(supportedGDAXProductsCache);
                })
                .catch(() => {
                    reject('Could not get the list of supported currencies from GDAX!');
                });
        }
    });
}

function getGDAXPrice(base: string, currency: string) {
    return new OfficeExtension.Promise((setResult, setError) => {
        getSupportedProducts()
            .then((supportedProducts) => {
                let productName = base + '-' + currency;
                if (productName in supportedProducts) {
                    request(`https://api.gdax.com/products/${productName}/book/`)
                        .then(rawResponse => {
                            let parsedResponse: GDAXBook = JSON.parse(rawResponse);
                            let bidPrice = parseFloat(<string>parsedResponse.bids[0][0]);
                            let askPrice = parseFloat(<string>parsedResponse.asks[0][0]);
                            let midMarketPrice = (bidPrice + askPrice) / 2;
                            setResult(midMarketPrice);
                        })
                        .catch(() => setError('#VALUE'));//setError("Find a book for that product"));
                } else {
                    setError('#VALUE'); //setError("Product not supported");
                }
            })
            .catch(() => setError('#VALUE'));//setError("Couldn't get list of supported products"));
    });
}

Office.initialize = function(reason){
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
        options: {batch: false, stream: false}
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
        options: {batch: false, stream: false}
    };
    
    Excel.run(function (context: Excel.RequestContext) {        
        context.workbook.customFunctions.addAll();
        return context.sync().then(function(){});
    }).catch(function(error){});
}; 