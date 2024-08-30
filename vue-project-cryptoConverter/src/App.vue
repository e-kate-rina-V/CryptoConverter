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
      <Register v-if="showRegister" />
      <Login v-if="showLogin" />
      <section>
        <nav class="rectangle-header">
          <button id="rectangle-2" @click="toggleHome">Home</button>
          <button id="rectangle-1" @click="toggleConverter">Converter</button>
        </nav>
        <Converter v-if="isConverterOpen" :setCrypto="mainStore.setSelectedCrypto" :cryptos="mainStore.topCryptos" />
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

<style>
header {
  min-width: 100%;
  min-height: 20%;
  position: fixed;
  display: flex;
  align-items: start;
}

main {
  min-width: 100%;
}

#footer {
  width: 101%;
  height: 100px;
  position: absolute;
  top: 100%;
  left: -1%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border: 1px solig rgba(255, 255, 255, 0.18);

}

#crypto-img {
  width: 50%;
  margin-left: 25%;
}

.auth-buttons {
  display: flex;
  gap: 20px;
  left: 15%;
}

.auth-buttons button {
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Quantico', cursive;
}

#sign-in-btn,
#log-in-btn {
  border: 2px solid white;
  color: white;
  background-color: black;
  border-radius: 5px;
}

#sign-in-btn:hover,
#log-in-btn:hover {
  opacity: .7;
  text-decoration: underline;
}

.auth {
  display: flex;
  flex-direction: column;
  color: white;
  gap: 10px;
}

.user-info {
  font-family: 'Quantico', cursive;
  text-align: center;
}

.blue-theme .user-info {
  color: black;
}

.rectangle-header {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 100px;
  left: 30%;
}

.rectangle-header button {
  background: none;
  border: none;
  font-family: 'Quantico', cursive;
  border-radius: 5%;
}

.rectangle-header button:hover {
  transform: scale(1.1);
}

#rectangle-1,
#rectangle-2 {
  position: relative;
  width: 260px;
  height: 75px;
  color: black;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  font-size: 20px;
  cursor: pointer;
  text-decoration: none;
}

#rectangle-1::before,
#rectangle-2::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 0.1;
  z-index: -1;
}

/**/
.results {
  display: flex;
  margin-top: 3%;
  margin-left: 4%;
  gap: 86px;
  font-family: 'Wallpoet', cursive;
  font-size: 35px;
  color: black;
}

#binance-img {
  width: 70px;
}

img {
  width: 50px;
  margin-left: 5%;
}

.crypto-data {
  display: flex;
  flex-direction: column;
}

.main-content {
  display: block;
}

/**/
.switch-theme {
  position: fixed;
  margin-top: 1%;
  margin-left: 90%;
}

.switch {
  position: absolute;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
  background: linear-gradient(54deg, rgba(68, 58, 218, 1) 0%, rgba(150, 140, 40, 1) 100%);
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background: linear-gradient(56deg, rgba(138, 150, 58, 1) 0%, rgba(105, 43, 73, 1) 100%);
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.violet-theme {
  background: rgb(138, 150, 58);
  background: linear-gradient(56deg, rgba(138, 150, 58, 1) 0%, rgba(105, 43, 73, 1) 100%);
}

.blue-theme {
  background: rgb(68, 58, 218);
  background: linear-gradient(54deg, rgba(68, 58, 218, 1) 0%, rgba(150, 140, 40, 1) 100%);
}
</style>
