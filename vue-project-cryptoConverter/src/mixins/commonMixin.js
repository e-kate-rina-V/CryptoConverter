export const commonMixin = {
  methods: {
    logMessage(message) {
      console.log(message);
    },
    formatCurrency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    }
  }
};
