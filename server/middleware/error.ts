export default defineEventHandler((event) => {
  event.node.res.on('finish', () => {
    if (event.node.res.statusCode >= 400) {
      console.error(`[Error：] ${event.method} ${event.path} - ${event.node.res.statusCode}`);
    }
  });
});
