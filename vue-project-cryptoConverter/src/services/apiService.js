import axios from 'axios';

const API_URLS = {
    binance: 'https://api.binance.com/api/v3/ticker/price?symbol=',
    kraken: 'https://api.kraken.com/0/public/Ticker?pair=',
    okx: 'https://www.okx.com/api/v5/market/ticker?instId=',
    binanceMarkets: 'https://api.binance.com/api/v3/exchangeInfo'
};

export async function getBinancePrice(symbol) {
    try {
        const response = await axios.get(`${API_URLS.binance}${symbol}USDT`);
        return parseFloat(response.data.price);
    } catch (error) {
        console.error('Error fetching Binance data', error);
        return null;
    }
}

export async function getKrakenPrice(symbol) {
    try {
        const response = await axios.get(`${API_URLS.kraken}${symbol}USDT`);
        const price = response.data.result[Object.keys(response.data.result)[0]].c[0];
        return parseFloat(price);
    } catch (error) {
        console.error('Error fetching Kraken data', error);
        return null;
    }
}

export async function getOkxPrice(symbol) {
    try {
        const response = await axios.get(`${API_URLS.okx}${symbol}-USDT`);
        const price = response.data.data[0].last;
        return parseFloat(price);
    } catch (error) {
        console.error('Error fetching OKX data', error);
        return null;
    }
}

export async function getTopCryptosFromBinance() {
    try {
        const response = await axios.get(API_URLS.binanceMarkets);
        const symbols = response.data.symbols
            .filter(symbol => symbol.quoteAsset === 'USDT')
            .map(symbol => symbol.symbol.replace('USDT', ''));

        return symbols;
    } catch (error) {
        console.error('Error fetching Binance markets', error);
        return [];
    }
}
