import legacy from '@vitejs/plugin-legacy';

enum PageType {
  MOBILE = 'mobile',
  PC = 'pc',
}

const env = import.meta.env;
const config = {
  pageType: PageType.MOBILE,
};

const getScript = () => {
  return env.NUXT_ENV !== 'prod' && env.NUXT_ENV !== 'dev'
    ? [
        {
          src: '/js/common/vconsole.min.js',
          type: 'text/javascript',
        },
        { innerHTML: 'new VConsole()' },
      ]
    : [];
};

const getVitePlugins = () => {
  const plugins = [];
  if (env.NUXT_ENV !== 'dev') {
    plugins.push(legacy());
  }
  return plugins;
};

const getPostcssPlugins = () => {
  if (config.pageType === PageType.MOBILE) {
    return [
      {
        'postcss-pxtorem': {
          rootValue: 100,
          propList: ['*'],
          selectorBlackList: ['.norem-'],
          exclude: (file: string) => {
            const paths = ['/node_modules\\/vant/'];
            return paths.some((path) => new RegExp(path).test(file));
          },
        },
      },
    ];
  } else {
    return [];
  }
};

export default defineNuxtConfig({
  app: {
    baseURL: '/',
    head: {
      script: getScript(),
    },
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: ['@element-plus/nuxt', '@vant/nuxt', '@nuxt/eslint', '@pinia/nuxt'],
  vant: {
    lazyload: true,
  },
  css: ['./app/assets/css/main.css'],
  devServer: {
    host: '0.0.0.0',
  },
  vite: {
    plugins: getVitePlugins(),
  },
  postcss: {
    plugins: {
      autoprefixer: {},
      'postcss-import': {},
      '@tailwindcss/postcss': {},
      ...getPostcssPlugins(),
    },
  },
  runtimeConfig: {
    databaseUrl: '',
  },
});