function ReloadServer({ app, compiler }) {
  app.get('/reload', (request, response, next) => {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.writeHead(200);

    let isEnd = false;
    compiler.hooks.done.tap('chrome reload plugin', () => {
      if (isEnd) return;
      response.flushHeaders();
      const data = `data: ${JSON.stringify({ time: new Date() })}\n\n`;
      response.write(data);
      response.end();
      isEnd = true;
    });

    request.on('close', () => {
      isEnd = true;
      response.end();
    });
  });
}

module.exports = ReloadServer;
