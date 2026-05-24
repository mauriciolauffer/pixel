<script setup lang="ts">
import { ref } from 'vue';
import { authClient } from '../services/auth-client';

const email = ref('');
const password = ref('');
const name = ref('');
const isLogin = ref(true);
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  try {
    if (isLogin.value) {
      await authClient.signIn.email({
        email: email.value,
        password: password.value,
      });
    } else {
      await authClient.signUp.email({
        email: email.value,
        password: password.value,
        name: name.value,
      });
    }
  } catch (e: any) {
    error.value = e.message || 'Authentication failed';
  }
};
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div v-if="!isLogin" class="form-group">
        <label>Name:</label>
        <input v-model="name" type="text" required />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit">{{ isLogin ? 'Sign In' : 'Sign Up' }}</button>
    </form>
    <p>
      {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
      <a href="#" @click.prevent="isLogin = !isLogin">
        {{ isLogin ? 'Register here' : 'Login here' }}
      </a>
    </p>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
}
.form-group {
  margin-bottom: 15px;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.error {
  color: red;
  margin-bottom: 10px;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
</style>
