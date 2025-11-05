import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { pretty, render } from '@react-email/render'

import VerificationTemplate from '@/modules/libs/mail/templates/verification.template'
import { type SessionMetadata } from '@/shared/types/session-metadata.types'

import { PasswordRecoveryTemplate } from './templates/password-recovery.template'

@Injectable()
export class MailService {
    public constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}

    public async sendVerificationToken(
        email: string,
        token: string
    ): Promise<any> {
        const domain = this.configService.get<string>(
            'ALLOWED_ORIGIN'
        ) as string
        const html = await pretty(
            await render(VerificationTemplate({ domain, token }))
        )

        return this.sendMail(email, 'Верификация аккаунта', html)
    }

    private sendMail(email: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to: email,
            subject,
            html
        })
    }

    public async sendPasswordRecoveryToken(
        email: string,
        token: string,
        metadata: SessionMetadata
    ): Promise<any> {
        const domain = this.configService.get<string>(
            'ALLOWED_ORIGIN'
        ) as string
        const html = await pretty(
            await render(PasswordRecoveryTemplate({ domain, token, metadata }))
        )

        return this.sendMail(email, 'Сброс пароля', html)
    }
}
