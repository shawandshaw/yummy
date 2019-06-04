const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const app = new Koa();







// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`); //eslint-disable-line
});




// static
app.use(serve(path.join('./dist')));




// router



app.listen(3000);
console.log('server is running at "localhost:3000"'); //eslint-disable-line