import koa from 'koa'
import koaRouter from 'koa-router'
import cluster from 'cluster'
import { cpus } from 'os'
import process from 'process'

const numCPUS = cpus().length
console.log(`CPU number: ${numCPUS}`)

if (cluster.isPrimary) {
    for (let index = 0; index < numCPUS; index++) {
        cluster.fork() 
    }
} else {
    const app = new koa()
    const router = new koaRouter()
    
    let count = 0
    router.get('/fast', async (ctx) => {
        ctx.body = `Count: ${count}; Worker: ${process.pid}`
        count++
    })
    
    
    router.get('/slow', async (ctx) => {
        let sum = 0
        for (let index = 0; index < 10000000000; index++) {
            sum = sum + index;
        }
        ctx.body = `Sum: ${sum}; Worker: ${process.pid}`
    })
    
    app.use(router.routes())
    
    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
    console.log(`Worker ${process.pid} started`)
}

