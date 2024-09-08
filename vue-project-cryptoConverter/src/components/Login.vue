<template>
  <div class="login-form">
    <button id="close-btn" @click="closeWindow">x</button>
    <h2>Log In</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <section class="log-in-btn">
        <button type="submit">Log In</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p>or</p>
        <button type="button" @click="signInWithGoogle">
          Log In with
          <img id="google-img" src="@/assets/img/google_logo_2.png" />
        </button>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </section>
    </form>
  </div>
</template>


<script>
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Cookies from 'js-cookie';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        this.successMessage = 'Logged in successfully! Welcome back, ' + user.email;
        this.email = '';
        this.password = '';
        this.errorMessage = '';

        Cookies.set('userEmail', user.email);

        this.$emit('user-logged-in', user);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'Пользователь с таким email не найден. Пожалуйста, зарегистрируйтесь.';
        } else if (error.code === 'auth/wrong-password') {
          this.errorMessage = 'Неверный пароль. Пожалуйста, попробуйте снова.';
        } else {
          this.errorMessage = 'Не удалось войти. Попробуйте снова. Неверный логин или пароль';
        }
      }
    },
    async signInWithGoogle() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        this.successMessage = 'Successfully logged in with Google!';
        this.email = '';
        this.password = '';
        this.errorMessage = '';

        Cookies.set('userEmail', user.email);

        this.$emit('user-logged-in', user);
      } catch (error) {
        this.errorMessage = 'Не удалось войти с помощью Google. Попробуйте снова.';
      }
    },
    closeWindow() {
      this.$emit('close');
    }
  }
};
</script>
