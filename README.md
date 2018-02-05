# Coinbase and GDAX Excel Functions

This repo contains two [Excel JavaScript Custom Functions](https://dev.office.com/docs/add-ins/excel/custom-functions-overview) that will pull the latest crypto currency prices from Coinbase or GDAX. They are modeled after the examples on the [Excel Custom Functions Starter Repo](https://github.com/OfficeDev/Excel-Custom-Functions).

Note: this add-in uses a publicly accessible REST APIs from Coinbase and GDAX, but the add-in itself is not affiliated with Coinbase or GDAX in any way. The author (Andrew Stegmaier) is an employee of Microsoft.

# Usage

After the add-in is installed (see instructions below), it adds two functions to Excel: `COINBASE.PRICE()` and `GDAX.PRICE`. The syntax is:
```
=COINBASE.PRICE(<Base>, <Currency>)
=GDAX.PRICE(<Base>, <Currency>)
```
Where `<Base>` is the three-letter currency code that you want to check the price of, and `<Currency>` is the code for the currency you want that price expressed in. For example, to fetch the current price of Bitcoin in US Dollars from Coinbase, you would write:
```
=COINBASE.PRICE("BTC","USD")
```
To do the same thing, but with the mid-market price from GDAX, you would write:
```
=GDAX.PRICE("BTC","USD")
```
You can get see the list of currency codes that Coinbase currently supports by checking [this REST endpoint](https://api.coinbase.com/v2/currencies). The same list for GDAX can be found at [this endpoint](https://api.gdax.com/products).

# Installation

1. Currently (February 2018), Excel JavaScript Custom Functions are only available for preview in the latest builds of Excel for Windows. You need to join th [Office Insider](https://products.office.com/en-us/office-insider) program, and install Office build number 8711 or later.
2. Download [manifest.xml](https://github.com/astegmaier/coinbase-excel-functions/blob/master/manifest.xml) from this repo.
3. Sideload the manifest using the instructions found at <https://aka.ms/sideload-addins>. The JavaScript and HTML files found in the wwwroot folder of this repo are already hosted at <https://excel-coinbase-prices.azurewebsites.net/>.