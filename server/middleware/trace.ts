import { context, trace } from '@opentelemetry/api';

export default defineEventHandler((event) => {
  const res = event.node.res;
  const path = getRequestURL(event).pathname;
  const runtimeConfig = useRuntimeConfig();
  const span = trace.getTracer(runtimeConfig.appName).startSpan(path);

  span.setAttribute('path', path);

  context.with(trace.setSpan(context.active(), span), () => {
    try {
      res.on('finish', () => {
        const currentSpan = trace.getSpan(context.active());
        if (currentSpan) {
          currentSpan.addEvent('Request processed successfully');
        }
        span.end();
      });

      res.on('error', (error) => {
        span.recordException(error);
        span.end();
      });
    } catch (error) {
      span.recordException(error + '');
      span.end();
      throw error;
    }
  });
});
