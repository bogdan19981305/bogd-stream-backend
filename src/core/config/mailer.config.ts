import type { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
    const host = configService.getOrThrow<string>('MAIL_HOST')
    const port = Number(configService.getOrThrow<string>('MAIL_PORT'))
    const userLogin = configService.getOrThrow<string>('MAIL_LOGIN')
    const userPassword = configService.getOrThrow<string>('MAIL_PASSWORD')

    if (!host || !port || !userLogin || !userPassword) {
        throw new Error(
            `Missing SMTP config: ${!host ? 'MAIL_HOST' : ''} ${!port ? 'MAIL_PORT' : ''} ${!userLogin ? 'MAIL_LOGIN' : ''} ${!userPassword ? 'MAIL_PASSWORD' : ''}`
        )
    }

    return {
        transport: {
            host,
            port,
            secure: Number(port) === 465,
            auth: {
                user: userLogin,
                pass: userPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        },
        defaults: {
            from: `"BogdStream" <${userLogin}>`
        }
    }
}
