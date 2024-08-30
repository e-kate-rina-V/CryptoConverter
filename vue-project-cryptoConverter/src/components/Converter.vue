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


<style>
.dropdown {
  position: relative;
  margin-top: 60%;
  margin-left: 500%;
  font-family: 'Quantico', cursive;
}

.dropdown-button {
  background-color: rgb(26, 23, 23);
  color: #fff;
  padding: 20px;
  border: 3px solid #000;
  border-radius: 3px;
  cursor: pointer;
  width: 200px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-family: 'Quantico', cursive;
}

.dropdown-button:hover {
  background: rgb(32, 32, 32);
}

.dropdown-container {
  position: absolute;
  width: 200px;
  background: rgb(26, 23, 23);
  border: 3px solid #000;
  border-radius: 3px;
  z-index: 1000;
  top: 100%;
  left: 0;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 2px solid #333;
  background: rgb(26, 23, 23);
  color: #fff;
  box-sizing: border-box;
}

.dropdown-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 8px;
}

.dropdown-menu li {
  display: block;
  color: #fff;
  padding: 10px;
  cursor: pointer;
}

.dropdown-menu li:hover,
.dropdown-menu li.active {
  background: rgb(41, 36, 36);
}

.no-results {
  color: #fff;
  padding: 10px;
  text-align: center;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.pagination-controls button {
  background: rgb(26, 23, 23);
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
}

.pagination-controls button:disabled {
  background: rgb(41, 36, 36);
  cursor: not-allowed;
}
</style>