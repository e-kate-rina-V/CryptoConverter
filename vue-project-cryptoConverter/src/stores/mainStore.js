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
    favorites: []
  }),
  getters: {
    getAverage(state) {
      const prices = [state.results?.kraken, state.results?.binance, state.results?.okx];
      const validPrices = prices.filter(price => price !== null);
      if (validPrices.length === 0) return null;
      const average = validPrices.reduce((sum, price) => sum + parseFloat(price), 0) / validPrices.length;
      return average ? average.toFixed(3) : null;
    },
    isFavorite: (state) => (crypto) => state.favorites.includes(crypto)
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
        this.loadFavorites(user.email);
      } else {
        Cookies.remove('userEmail');
        this.favorites = [];
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
        this.loadFavorites(email);
      }
    },
    addFavorite(crypto) {
      if (this.user) {
        if (!this.favorites.includes(crypto)) {
          this.favorites.push(crypto);
          this.saveFavorites(this.user.email);
        }
      } else {
        console.log('User not logged in');
      }
    },
    removeFavorite(crypto) {
      if (this.user) {
        this.favorites = this.favorites.filter(fav => fav !== crypto);
        this.saveFavorites(this.user.email);
      }
    },
    loadFavorites(email) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${email}`) || '[]');
      this.favorites = favorites;
    },
    saveFavorites(email) {
      localStorage.setItem(`favorites_${email}`, JSON.stringify(this.favorites));
    }
  }
});
