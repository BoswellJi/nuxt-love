<script setup lang="ts">
const { error } = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:shadow-2xl"
    >
      <!-- Error Status Code -->
      <div
        class="text-9xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        {{ error?.status }}
      </div>

      <!-- Error Message -->
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
        {{ error?.statusMessage || 'Something went wrong' }}
      </h2>

      <!-- Error Description -->
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        {{ error?.message || 'We apologize for the inconvenience. Please try again later.' }}
      </p>

      <!-- Back to Home Button -->
      <button
        class="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-600 rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-700 text-white"
        @click="handleError"
      >
        <span
          class="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-50"
        ></span>
        <span
          class="absolute left-0 w-0 h-0 border-t-24 border-t-transparent border-l-24 border-l-white opacity-20 group-hover:border-l-32 transition-all duration-200"
        ></span>
        <span class="relative flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Home
        </span>
      </button>

      <!-- Additional Info -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Error Code: {{ error?.data?.code || error?.status }}
        </p>
      </div>
    </div>
  </div>
</template>
