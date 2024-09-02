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