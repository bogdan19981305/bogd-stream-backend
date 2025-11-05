import { TokenType } from '@generated/prisma'
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import * as argon2 from 'argon2'
import { type Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { MailService } from '@/modules/libs/mail/mail.service'
import { generateToken } from '@/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/shared/utils/session-metadata.utils'

import { NewPasswordInput } from './inputs/new-password.input'
import { ResetPasswordInput } from './inputs/reset-password.input'

@Injectable()
export class PasswordRecoveryService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) {}

    public async resetPassword(
        input: ResetPasswordInput,
        req: Request,
        userAgent: string
    ) {
        const { email } = input

        const user = await this.prismaService.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        const passwordResetToken = await generateToken(
            this.prismaService,
            user,
            TokenType.PASSWORD_RESET,
            true
        )

        const metaData = getSessionMetadata(req, userAgent)
        await this.mailService.sendPasswordRecoveryToken(
            email,
            passwordResetToken.token,
            metaData
        )

        return true
    }

    public async newPassword(input: NewPasswordInput) {
        const { password, token } = input

        const passwordResetToken = await this.prismaService.token.findUnique({
            where: { token, type: TokenType.PASSWORD_RESET }
        })

        if (!passwordResetToken) {
            throw new NotFoundException('Токен не найден')
        }

        if (passwordResetToken.expiresIn < new Date()) {
            throw new BadRequestException('Токен просрочен')
        }

        const hashedPassword = await argon2.hash(password)

        await this.prismaService.user.update({
            where: { id: passwordResetToken.userId! },
            data: { password: hashedPassword }
        })

        await this.prismaService.token.delete({
            where: {
                id: passwordResetToken.id,
                type: TokenType.PASSWORD_RESET
            }
        })

        return true
    }
}
