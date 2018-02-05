var testSupportedCurrenciesCache: CurrencyList;
var testSupportedGDAXProductsCache: GDAXProductsList;

function testRequest(url: string): Promise<any> {
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
      xhr.send();
    })
  }

async function testGetSupportedCurrencies(): Promise<CurrencyList> {
    if (testSupportedCurrenciesCache) {
        return testSupportedCurrenciesCache;
    } else {
        let rawResponse = await testRequest('https://api.coinbase.com/v2/currencies');
        try {
            let parsedResponse: {data: CurrencyCodeDetails[]} = JSON.parse(rawResponse);
            testSupportedCurrenciesCache = {};
            parsedResponse.data.forEach((value) => {
                testSupportedCurrenciesCache[value.id] = value;
            });
            console.log('Got this list of supported currencies: ', testSupportedCurrenciesCache);
            return testSupportedCurrenciesCache;
        } catch (e) {
            console.error('Could not get the list of supported currencies from Coinbase! Error was: ' + e);
        }
    }
}

async function testConvertCurrency(from: string, to: string) {
    let supportedCurrencies = await testGetSupportedCurrencies();
    if (from in supportedCurrencies && to in supportedCurrencies) {
        try {
            let rawResponse = await testRequest(`https://api.coinbase.com/v2/prices/${from}-${to}/spot`);
            let parsedResponse: {data: ConversionResult} = JSON.parse(rawResponse);
            console.log(parsedResponse);
        } catch (e) {
            console.error('Couldnt convert the currencies. Error was: ' + e);
        }
    } else {
        console.error('Currency not supported!');
    }
}

async function testGetSupportedGDAXProducts(): Promise<GDAXProductsList> {
    if (testSupportedGDAXProductsCache) {
        return testSupportedGDAXProductsCache;
    } else {
        let rawResponse = await testRequest('https://api.gdax.com/products/');
        try {
            let parsedResponse: GDAXProduct[] = JSON.parse(rawResponse);
            testSupportedGDAXProductsCache = {};
            parsedResponse.forEach((value) => {
                testSupportedGDAXProductsCache[value.id] = value;
            });
            console.log('Got this list of supported GDAX products: ', testSupportedGDAXProductsCache);
            return testSupportedGDAXProductsCache;
        } catch (e) {
            console.error('Could not get the list of supported currencies from GDAX! Error was: ' + e);
        }
    }
}

async function testGdaxPrices(from: string, to: string) {
    let supportedProducts = await testGetSupportedGDAXProducts();
    let productName = from + '-' + to;
    if (productName in supportedProducts) {
        try {
            let rawResponse = await testRequest(`https://api.gdax.com/products/${productName}/book/`);
            let parsedResponse: GDAXBook = JSON.parse(rawResponse);
            let bidPrice = parseFloat(<string>parsedResponse.bids[0][0]);
            let askPrice = parseFloat(<string>parsedResponse.asks[0][0]);
            let midMarketPrice = (bidPrice + askPrice) / 2;
            console.log(midMarketPrice);
        } catch (e) {
            console.error('Couldnt look up the GDAX product. Error was: ' + e);
        }
    } else {
        console.error('Product not supported!');
    }
}