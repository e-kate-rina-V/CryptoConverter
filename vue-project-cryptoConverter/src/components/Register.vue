<template>
  <div class="register-form">
    <h2>Sign In</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <section class="sign-in-btn">
        <button type="submit">Register</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p>or</p>
        <button type="button" @click="signInWithGoogle">Sign In with <img id="google-img"
            src="C:/Users/user/VS Code Projects/CryptoConverter/img/google_logo_2.png" /></button>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </section>
    </form>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from 'js-cookie';

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        this.successMessage = 'Registration successful! Welcome, ' + user.email;
        this.email = '';
        this.password = '';
        this.errorMessage = '';
        Cookies.set('userEmail', user.email);
        this.$emit('user-logged-in', user);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Пользователь с таким email уже существует. Попробуйте войти или используйте другой email.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'Неверный формат email. Проверьте введённый email.';
        } else if (error.code === 'auth/weak-password') {
          this.errorMessage = 'Пароль слишком простой. Используйте более сложный пароль. Минимум шесть символов';
        } else {
          this.errorMessage = 'Не удалось зарегистрироваться. Попробуйте снова.';
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
    }
  }
};
</script>

<style scoped>
.register-form {
  display: block;
  position: fixed;
  width: 400px;
  padding: 1em;
  background: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  left: 38%;
  top: 32%;
  background-color: black;
  color: white;
  opacity: .9;
  z-index: 2;
  font-family: 'Quantico', cursive;
}

h2 {
  margin-bottom: 1em;
  text-align: center;
}

#google-img {
  width: 25px;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: bold;
}

input {
  border: 1px solid #ccc;
  padding: 0.5em;
  width: 100%;
  border-radius: 4px;
}

button {
  padding: 0.7em;
  border: 1px solid white;
  border-radius: 3px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  background-color: black;
}

.sign-in-btn {
  display: grid;
  text-align: center;
}

button:hover {
  transform: scale(0.9);
}

.error-message {
  color: red;
  margin-top: 1em;
}

.success-message {
  color: green;
  margin-top: 1em;
}
</style>
