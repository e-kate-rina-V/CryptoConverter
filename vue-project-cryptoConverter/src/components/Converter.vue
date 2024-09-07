<template>
  <div>
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
            <button v-if="!isFavorite(crypto)" @click.stop="addToFavorites(crypto)" class="favorite-button">
              ❤️
            </button>
            <button v-if="isFavorite(crypto)" @click.stop="removeFromFavorites(crypto)" class="favorite-button">
              ❌
            </button>
          </li>
          <li v-if="filteredCryptos.length === 0" class="no-results">No results found</li>
        </ul>
        <div class="pagination-controls">
          <button @click="previousPage" :disabled="currentPage === 0">Previous</button>
          <button @click="nextPage" :disabled="currentPage >= totalPages - 1">Next</button>
        </div>
      </div>
    </div>

    <div class="favorites-dropdown">
      <button @click="toggleFavoritesDropdown" class="dropdown-button">
        Favorites
      </button>
      <div v-show="isFavoritesDropdownOpen" class="dropdown-container">
        <ul class="dropdown-menu">
          <li v-for="fav in paginatedFavorites" :key="fav">
            <button @click="selectItem(fav)" class="favorite-select-button">
              {{ fav }}
            </button>
          </li>
          <li v-if="mainStore.favorites.length === 0" class="no-results">No favorites found</li>
        </ul>
        <div class="pagination-controls">
          <button @click="previousFavoritesPage" :disabled="favoritesPage === 0">Previous</button>
          <button @click="nextFavoritesPage" :disabled="favoritesPage >= favoritesTotalPages - 1">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '@/stores/mainStore';

export default {
  name: 'Converter',
  props: {
    setCrypto: {
      type: Function,
      required: true
    },
    cryptos: {
      type: Array,
      default: () => [],
    }
  },
  setup() {
    const mainStore = useMainStore();
    return { mainStore };
  },
  data() {
    return {
      current: '',
      isDropdownOpen: false,
      isFavoritesDropdownOpen: false,
      searchQuery: '',
      currentPage: 0,
      itemsPerPage: 4,
      favoritesPage: 0
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
    },
    favoritesTotalPages() {
      return Math.ceil(this.mainStore.favorites.length / this.itemsPerPage);
    },
    paginatedFavorites() {
      const start = this.favoritesPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.mainStore.favorites.slice(start, end);
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    toggleFavoritesDropdown() {
      this.isFavoritesDropdownOpen = !this.isFavoritesDropdownOpen;
    },
    selectItem(val) {
      this.setCrypto(val);
      this.current = val;
      this.isDropdownOpen = false;
    },
    addToFavorites(crypto) {
      this.mainStore.addFavorite(crypto);
    },
    removeFromFavorites(crypto) {
      this.mainStore.removeFavorite(crypto);
    },
    isFavorite(crypto) {
      return this.mainStore.isFavorite(crypto);
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
    },
    previousFavoritesPage() {
      if (this.favoritesPage > 0) {
        this.favoritesPage--;
      }
    },
    nextFavoritesPage() {
      if (this.favoritesPage < this.favoritesTotalPages - 1) {
        this.favoritesPage++;
      }
    }
  }
}
</script>
