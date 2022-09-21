import koa from 'koa'
import koaRouter from 'koa-router'
import { Worker } from 'worker_threads'

const app = new koa()
const router = new koaRouter()

let count = 0
router.get('/fast', (ctx) => {
    ctx.body = count
    count++
})


router.get('/slow', async (ctx) => {
    const data = await slowFunction()
    ctx.body = data
})

app.use(router.routes())

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const slowFunction = () => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js')
        worker.on('message', (data) => {
            resolve(data)
        })
        worker.on('error', () => {
            reject()
        })
    })
}