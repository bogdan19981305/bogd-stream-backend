import { MailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { getMailerConfig } from '@/core/config/mailer.config'

import { MailService } from './mail.service'

@Global()
@Module({
    controllers: [],
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMailerConfig
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
