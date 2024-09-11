<template>
  <div>
    <div>
      <input id="crypto-input" min="0" type="number" @input="handleInputChange"
        placeholder="Введите количество валюты">
    </div>
    <button id="convert-btn" @click="convert">Convert</button>
  </div>
</template>

<script>
import { commonMixin } from '@/mixins/commonMixin'; 

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
  },
  mixins: [commonMixin], 
  methods: {
    handleInputChange(event) {
      const value = event.target.value;
      this.changeAmount(value);
      this.logMessage(`Input value: ${value}`);
    }
  }
}
</script>
