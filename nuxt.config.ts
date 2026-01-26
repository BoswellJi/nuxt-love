import legacy from '@vitejs/plugin-legacy';

enum PageType {
  MOBILE = 'mobile',
  PC = 'pc',
}

const config = {
  pageType: PageType.MOBILE,
};

enum EnvType {
  DEV = 'dev',
  QA = 'qa',
  Stage = 'stage',
  PROD = 'prod',
}

const env = import.meta.env;

const getScript = () => {
  const scripts = [];
  if (env.NUXT_ENV !== EnvType.PROD && env.NUXT_ENV !== EnvType.DEV) {
    if (config.pageType === PageType.MOBILE) {
      scripts.push(
        ...[
          {
            src: '/js/common/vconsole.min.js',
            type: 'text/javascript',
          },
          { innerHTML: 'new VConsole()' },
          { src: '/js/common/flexible.js', strategy: 'beforeInteractive' },
        ],
      );
    }
  } else {
    if (config.pageType === PageType.MOBILE) {
      scripts.push(
        ...[
          {
            src: '/js/common/flexible.js',
            strategy: 'beforeInteractive',
          },
        ],
      );
    }
  }
  return scripts;
};

const getMeta = () => {
  if (config.pageType === PageType.MOBILE) {
    return [
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
      },
      { name: 'format-detection', content: 'telephone=no, email=no' },
      { httpEquiv: 'X-UA-Compatible', content: 'IE=edge, chrome=1' },
    ];
  } else if (config.pageType === PageType.PC) {
    return [];
  }
};

const getModules = () => {
  const modules = ['@nuxt/eslint', '@pinia/nuxt', '@sentry/nuxt/module'];

  if (PageType.MOBILE === config.pageType) {
    modules.push('@vant/nuxt');
  } else if (PageType.PC === config.pageType) {
    modules.push('@element-plus/nuxt');
  }

  return modules;
};

const getVitePlugins = () => {
  const plugins = [];
  if (env.NUXT_ENV !== 'dev') {
    plugins.push(legacy());
  }
  return plugins;
};

const getPostCssPlugins = () => {
  const plugins: Record<string, any> = {
    autoprefixer: {},
    'postcss-import': {},
    '@tailwindcss/postcss': {},
  };
  if (config.pageType === PageType.MOBILE) {
    plugins['postcss-pxtorem'] = {
      rootValue: 37.5,
      propList: ['*'],
      selectorBlackList: ['html', 'body'],
      minPixelValue: 1,
    };
  }
  return plugins;
};

export default defineNuxtConfig({
  app: {
    baseURL: '/',
    head: {
      script: getScript(),
      meta: getMeta(),
    },
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: getModules(),
  sentry: {},
  vant: {
    lazyload: true,
  },
  css: ['./app/assets/css/main.css'],
  devServer: {
    host: '0.0.0.0',
    port: 3001,
  },
  vite: {
    plugins: getVitePlugins(),
  },
  postcss: {
    plugins: getPostCssPlugins(),
  },
  runtimeConfig: {
    proxyTarget: '',
  },
});
