import { TokenType, User } from '@generated/prisma'
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { DeactivateAccountInput } from '@/modules/auth/deactivate/inputs/deactivate-account.input'
import { MailService } from '@/modules/libs/mail/mail.service'
import { generateToken } from '@/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/shared/utils/session-metadata.utils'
import { destroySession } from '@/shared/utils/session.util'

@Injectable()
export class DeactivateService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) {}

    public async deactivate(
        req: Request,
        input: DeactivateAccountInput,
        user: User,
        userAgent: string
    ) {
        const { email, password, pin } = input

        if (user.email !== email) {
            throw new BadRequestException('Неверная почта')
        }

        const isValidPassword = await verify(user.password, password)

        if (!isValidPassword) {
            throw new BadRequestException('Неверный пароль')
        }

        if (!pin) {
            await this.sendDeactivateToken(req, user, userAgent)
            return { message: 'Требуеться код подтверждения' }
        }

        await this.validateDiactivateToken(req, pin)

        return { user }
    }

    public async sendDeactivateToken(
        req: Request,
        user: User,
        userAgent: string
    ) {
        const deactivationToken = await generateToken(
            this.prismaService,
            user,
            TokenType.ACCOUNT_DEACTIVATE,
            false
        )

        const metaData = getSessionMetadata(req, userAgent)

        await this.mailService.sendAccountDeactivateToken(
            user.email,
            deactivationToken.token,
            metaData
        )

        return true
    }

    private async validateDiactivateToken(req: Request, token: string) {
        const existingToken = await this.prismaService.token.findUnique({
            where: { token, type: TokenType.ACCOUNT_DEACTIVATE }
        })

        if (!existingToken) {
            throw new NotFoundException('Токен не найден')
        }

        if (existingToken.expiresIn < new Date()) {
            throw new BadRequestException('Токен просрочен')
        }

        await this.prismaService.user.update({
            where: { id: existingToken.userId! },
            data: { isDeactivated: true, deactivatedAt: new Date() }
        })

        await this.prismaService.token.delete({
            where: { id: existingToken.id, type: TokenType.ACCOUNT_DEACTIVATE }
        })

        return destroySession(req, this.configService)
    }
}
