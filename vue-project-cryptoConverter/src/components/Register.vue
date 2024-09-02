<template>
  <div class="register-form">
    <button id="close-btn" @click="closeWindow">x</button>
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
import { ref } from 'vue';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from 'js-cookie';

export default {
  name: 'Register',
  setup(props, { emit }) {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const successMessage = ref('');

    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        successMessage.value = 'Registration successful! Welcome, ' + user.email;
        email.value = '';
        password.value = '';
        errorMessage.value = '';
        Cookies.set('userEmail', user.email);
        emit('user-logged-in', user);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          errorMessage.value = 'Пользователь с таким email уже существует. Попробуйте войти или используйте другой email.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage.value = 'Неверный формат email. Проверьте введённый email.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage.value = 'Пароль слишком простой. Используйте более сложный пароль. Минимум шесть символов';
        } else {
          errorMessage.value = 'Не удалось зарегистрироваться. Попробуйте снова.';
        }
      }
    };

    const signInWithGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        successMessage.value = 'Successfully logged in with Google!';
        email.value = '';
        password.value = '';
        errorMessage.value = '';
        Cookies.set('userEmail', user.email);
        emit('user-logged-in', user);
      } catch (error) {
        errorMessage.value = 'Не удалось войти с помощью Google. Попробуйте снова.';
      }
    };

    const closeWindow = () => {
      emit('close');
    };

    return {
      email,
      password,
      errorMessage,
      successMessage,
      register,
      signInWithGoogle,
      closeWindow
    };
  }
};
</script>
