import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useMainStore = defineStore('main', {
  state: () => ({
    theme: 'blue-theme',
    user: null,
    selectedCrypto: '',
    amount: 0,
    results: null,
    topCryptos: [],
  }),
  getters: {
    getAverage(state) {
      const prices = [state.results?.kraken, state.results?.binance, state.results?.okx];
      const validPrices = prices.filter(price => price !== null);
      if (validPrices.length === 0) return null;
      const average = validPrices.reduce((sum, price) => sum + parseFloat(price), 0) / validPrices.length;
      return average ? average.toFixed(3) : null;
    }
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'violet-theme' ? 'blue-theme' : 'violet-theme';
      document.body.className = this.theme;
    },
    setUser(user) {
      this.user = user;
      if (user) {
        Cookies.set('userEmail', user.email);
      } else {
        Cookies.remove('userEmail');
      }
    },
    setSelectedCrypto(crypto) {
      this.selectedCrypto = crypto;
    },
    setAmount(value) {
      this.amount = parseFloat(value);
    },
    setResults(results) {
      this.results = results;
    },
    setTopCryptos(cryptos) {
      this.topCryptos = cryptos;
    },
    getUserFromCookies() {
      const email = Cookies.get('userEmail');
      if (email) {
        this.user = { email };
      }
    }
  }
});
