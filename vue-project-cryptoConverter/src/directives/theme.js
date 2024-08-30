// directives/theme.js
export default {
    bind(el, binding, vnode) {
      const { value } = binding;
      el.classList.add(value);
    },
    update(el, binding) {
      el.classList.remove(binding.oldValue);
      el.classList.add(binding.value);
    },
  };
  