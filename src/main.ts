import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { createClient } from 'redis'

import { CoreModule } from './core.module'
import { isProd } from './shared/utils/is-dev.util'
import { ms, StringValue } from './shared/utils/ms.util'
import { parseBoolean } from './shared/utils/parse-boolean.util'

async function bootstrap() {
    const app = await NestFactory.create(CoreModule)

    const config = app.get(ConfigService)

    try {
        const cookieSecret = config.getOrThrow<string>('COOKIES_SECRET')
        app.use(cookieParser(cookieSecret))
    } catch (error) {
        console.error('COOKIES_SECRET is not set', error)
        process.exit(1)
    }

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
        })
    )

    try {
        const allowedOrigin = config.getOrThrow<string>('ALLOWED_ORIGIN')
        app.enableCors({
            origin: allowedOrigin,
            credentials: true,
            exposedHeaders: ['Set-Cookie']
        })
    } catch (error) {
        console.error('ALLOWED_ORIGIN is not set', error)
        process.exit(1)
    }

    try {
        const sessionSecret = config.getOrThrow<string>('SESSION_SECRET')
        const sessionName = config.getOrThrow<string>('SESSION_NAME')
        const sessionDomain = config.getOrThrow<string>('SESSION_DOMAIN')
        const sessionMaxAge = config.getOrThrow<StringValue>('SESSION_MAX_AGE')
        const sessionHttpOnly = config.getOrThrow<string>('SESSION_HTTP_ONLY')
        const sessionSecure = config.getOrThrow<string>('SESSION_SECURE')
        const sessionFolder = config.getOrThrow<string>('SESSION_FOLDER')

        const redisClient = createClient()
        await redisClient.connect()

        const redisStore = new RedisStore({
            client: redisClient,
            prefix: sessionFolder
        })

        app.use(
            session({
                secret: sessionSecret,
                name: sessionName,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    ...(isProd(config) && sessionDomain
                        ? { domain: sessionDomain }
                        : {}),
                    maxAge: ms(sessionMaxAge),
                    httpOnly: parseBoolean(sessionHttpOnly),
                    secure: parseBoolean(sessionSecure),
                    sameSite: 'lax'
                },
                store: redisStore
            })
        )
    } catch (error) {
        console.error(
            'SESSION_SECRET or SESSION_NAME or SESSION_DOMAIN or SESSION_MAX_AGE or SESSION_HTTP_ONLY or SESSION_SECURE or SESSION_FOLDER is not set',
            error
        )
        process.exit(1)
    }

    try {
        const port = config.getOrThrow<number>('PORT')
        await app.listen(port)
        console.log(`Server is running on port ${port}`)
    } catch (error) {
        console.error('PORT is not set', error)
        process.exit(1)
    }
}
bootstrap().catch(console.error)
