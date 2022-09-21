import koa from 'koa'
import koaRouter from 'koa-router'

const app = new koa()
const router = new koaRouter()

let count = 0
router.get('/fast', async (ctx) => {
    ctx.body = count
    count++
})


router.get('/slow', async (ctx) => {
    let sum = 0
    for (let index = 0; index < 10000000000; index++) {
        sum = sum + index;
    }
    ctx.body = sum
})

app.use(router.routes())

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})