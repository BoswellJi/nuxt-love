import { TrendClient } from 'tcwireless-component-trend';

const trend = TrendClient.create();

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig();
  const env = runtimeConfig.env;

  event.context.log = (name: string, tag: any, value: number) => {
    try {
      if (!tag) {
        tag = {};
      }
      const map = new Map();
      for (let key in tag) {
        map.set(key, tag[key]);
      }
      map.set('agentenv', env);

      trend.logMetricCustomized(name, map, value);
    } catch (e) {
      logger.error('趋势指标记录失败' + e);
    }
  };

  trend.init(runtimeConfig.appName);
  trend.start();
  logger.info('趋势指标初始化成功 ' + runtimeConfig.appName);
});
