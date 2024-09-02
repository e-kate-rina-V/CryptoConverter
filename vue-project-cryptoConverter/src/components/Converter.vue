<template>
  <div class="dropdown">
    <button @click="toggleDropdown" class="dropdown-button">
      {{ current || 'Select Crypto' }}
    </button>
    <div v-show="isDropdownOpen" class="dropdown-container">
      <input v-model="searchQuery" class="search-input" placeholder="Search..." />
      <ul class="dropdown-menu">
        <li v-for="crypto in paginatedCryptos" :key="crypto" @click="selectItem(crypto)"
          :class="{ active: current === crypto }">
          {{ crypto }}
        </li>
        <li v-if="filteredCryptos.length === 0" class="no-results">No results found</li>
      </ul>
      <div class="pagination-controls">
        <button @click="previousPage" :disabled="currentPage === 0">Previous</button>
        <button @click="nextPage" :disabled="currentPage >= totalPages - 1">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { commonMixin } from '../mixins/commonMixin';

export default {
  name: 'Converter',
  mixins: [commonMixin],
  props: {
    setCrypto: {
      type: Function,
      required: true
    },
    cryptos: {
      type: Array,
      default: () => []
    },
    favorites: {
      type: Array,
      default: () => [],
    },
    addFavorite: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      current: '',
      isDropdownOpen: false,
      searchQuery: '',
      currentPage: 0,
      itemsPerPage: 4
    }
  },
  computed: {
    filteredCryptos() {
      const query = this.searchQuery.toLowerCase();
      return this.cryptos
        .filter(crypto => crypto.toLowerCase().includes(query));
    },
    totalPages() {
      return Math.ceil(this.filteredCryptos.length / this.itemsPerPage);
    },
    paginatedCryptos() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCryptos.slice(start, end);
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectItem(val) {
      this.setCrypto(val);
      this.current = val;
      this.isDropdownOpen = false;
    },
    addToFavorites(crypto) {
      this.addFavorite(crypto);
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    }
  },
  watch: {
    searchQuery(newVal) {
      this.logMessage(`User input: ${newVal}`);
    }
  }
}
</script>
