<template>
  <div>
    <header v-theme="mainStore.theme">
      <slot name="header-content"></slot>
      <div class="auth">
        <div class="auth-buttons">
          <button id="sign-in-btn" @click="toggleRegister">Sign In</button>
          <button id="log-in-btn" @click="toggleLogin">Log In</button>
        </div>
        <div v-if="mainStore.user" class="user-info">
          You are logged in as:<br> {{ mainStore.user.email }}
        </div>
      </div>
      <Register v-if="showRegister" @close="showRegister = false" @user-logged-in="handleUserLoggedIn"></Register>
      <Login v-if="showLogin" @close="showLogin = false" @user-logged-in="handleUserLoggedIn"></Login>
      <section>
        <nav class="rectangle-header">
          <router-link to="/home" class="router"><button id="rectangle-2"
              @click="toggleHome">Home</button></router-link>
          <router-link to="/converter" class="router"><button id="rectangle-1"
              @click="toggleConverter">Converter</button></router-link>
        </nav>
        <Converter v-if="isConverterOpen" :setCrypto="mainStore.setSelectedCrypto" :cryptos="mainStore.topCryptos"
          :favorites="mainStore.favorites" :addFavorite="mainStore.addFavorite"
          :removeFavorite="mainStore.removeFavorite" :isFavorite="mainStore.isFavorite" />
        <Home v-if="isHomeOpen" />
      </section>
      <section class="switch-theme">
        <label class="switch">
          <input type="checkbox" @change="mainStore.toggleTheme" :checked="mainStore.theme === 'violet-theme'">
          <span class="slider"></span>
        </label>
      </section>
    </header>
    <main>
      <slot name="main-content">
        <div v-if="isConverterOpen">
          <Input :changeAmount="mainStore.setAmount" :convert="convert" />
          <div class="results" v-if="mainStore.results">
            <section class="crypto-data">
              <img id="kraken-img" src="C:/Users/user/VS Code Projects/CryptoConverter/img/kraken_logo.png" />
              <div class="crypto-text">
                <p v-if="mainStore.results.kraken"> Kraken: {{
                  mainStore.results.kraken }} USDT</p>
                <p v-else>Kraken: no data available</p>
              </div>
            </section>
            <section class="crypto-data">
              <img id="binance-img" src="C:/Users/user/VS Code Projects/CryptoConverter/img/binance_logo.png" />
              <p v-if="mainStore.results.binance"> Binance: {{
                mainStore.results.binance }} USDT</p>
              <p v-else>Binance: no data available</p>
            </section>
            <section class="crypto-data">
              <img id="okx-img" src="C:/Users/user/VS Code Projects/CryptoConverter/img/okx_logo.png" />
              <p v-if="mainStore.results.okx">OKX: {{ mainStore.results.okx
                }} USDT</p>
              <p v-else>OKX: no data available</p>
            </section>
            <section class="crypto-data">
              <img id="average-img" src="C:/Users/user/VS Code Projects/CryptoConverter/img/average_logo.png" />
              <p v-if="mainStore.results.kraken || mainStore.results.binance || mainStore.results.okx">
                Average price: {{ mainStore.getAverage }} USDT
              </p>
            </section>
          </div>
        </div>
      </slot>
    </main>
    <footer>
      <div id="footer"><img id="crypto-img" src="C:/Users/user/VS Code Projects/CryptoConverter/img/crypto_logos.png" />
      </div>
    </footer>
  </div>
</template>

<script>
import { useMainStore } from '@/stores/mainStore';
import Converter from './components/Converter.vue';
import Home from './components/Home.vue';
import Input from './components/Input.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { getBinancePrice, getKrakenPrice, getOkxPrice, getTopCryptosFromBinance } from './services/apiService.js';

export default {
  components: {
    Register,
    Login,
    Converter,
    Input,
    Home
  },
  data() {
    return {
      isConverterOpen: false,
      isHomeOpen: true,
      showRegister: false,
      showLogin: false,
    };
  },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  methods: {
    toggleConverter() {
      this.isConverterOpen = !this.isConverterOpen;
      if (this.isConverterOpen) {
        this.isHomeOpen = false;
      }
    },
    toggleHome() {
      this.isHomeOpen = !this.isHomeOpen;
      if (this.isHomeOpen) {
        this.isConverterOpen = false;
      }
    },
    toggleRegister() {
      this.showRegister = !this.showRegister;
      this.showLogin = false;
    },
    toggleLogin() {
      this.showLogin = !this.showLogin;
      this.showRegister = false;
    },
    async convert() {
      if (!this.mainStore.selectedCrypto || this.mainStore.amount <= 0) return;

      try {
        const symbol = this.mainStore.selectedCrypto;
        const [binancePrice, krakenPrice, okxPrice] = await Promise.all([
          getBinancePrice(symbol),
          getKrakenPrice(symbol),
          getOkxPrice(symbol)
        ]);

        this.mainStore.setResults({
          binance: binancePrice !== null ? (binancePrice * this.mainStore.amount).toFixed(3) : null,
          kraken: krakenPrice !== null ? (krakenPrice * this.mainStore.amount).toFixed(3) : null,
          okx: okxPrice !== null ? (okxPrice * this.mainStore.amount).toFixed(3) : null
        });
      } catch (error) {
        console.error('Error fetching conversion data', error);
      }
    },
    async loadTopCryptos() {
      try {
        const cryptos = await getTopCryptosFromBinance();
        this.mainStore.setTopCryptos(cryptos);
      } catch (error) {
        console.error('Error fetching top cryptos from Binance', error);
      }
    }
  },
  mounted() {
    this.mainStore.getUserFromCookies();
    this.mainStore.toggleTheme();
    this.loadTopCryptos();

    onAuthStateChanged(auth, (user) => {
      this.mainStore.setUser(user);
    });
  }
};
</script>
