export default {
  bind(el, binding) {
    const { value } = binding;
    el.classList.add(value);
  },
  update(el, binding) {
    el.classList.remove(binding.oldValue);
    el.classList.add(binding.value);
  },
};
