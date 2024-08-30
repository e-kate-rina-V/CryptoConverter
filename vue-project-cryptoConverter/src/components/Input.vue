<template>
  <div>
    <div>
      <input id="crypto-input" min="0" type="number" @input="changeAmount($event.target.value)"
        placeholder="Введите количество валюты">
    </div>
    <button id="convert-btn" @click="convert">Convert</button>
  </div>
</template>

<script>
export default {
  props: {
    changeAmount: {
      type: Function,
      required: true
    },
    convert: {
      type: Function,
      required: true
    }
  }
}
</script>

<style>
#crypto-input {
  outline: none;
  width: 500px;
  border-radius: 3px;
  border: 0;
  background: black;
  padding: 8px 10px;
  font-size: 1.2em;
  margin-top: 20%;
  margin-left: 35%;
  color: white;
  opacity: .8;
}

#convert-btn {
  margin-top: 3%;
  padding: 15px 20px;
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
  background: black;
  opacity: .8;
  border: 0;
  border-radius: 3px;
  margin-left: 47%;
  font-family: 'Quantico', cursive;
}

#convert-btn:hover {
  background: rgb(32, 32, 32);
  transform: scale(1.1);
}
</style>