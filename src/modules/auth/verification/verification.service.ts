import { TokenType, User } from '@generated/prisma'
import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { type Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { MailService } from '@/modules/libs/mail/mail.service'
import { generateToken } from '@/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/shared/utils/session-metadata.utils'
import { saveSession } from '@/shared/utils/session.util'

import { VerificationInput } from './inputs/verification.input'

@Injectable()
export class VerificationService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService
    ) {}

    public async verifyEmailToken(
        input: VerificationInput,
        req: Request,
        userAgent: string
    ) {
        const { token } = input

        const existingToken = await this.prismaService.token.findUnique({
            where: { token, type: TokenType.EMAIL_VERIFICATION }
        })

        if (!existingToken) {
            throw new NotFoundException('Токен не найден')
        }

        if (existingToken.expiresIn < new Date()) {
            throw new BadRequestException('Токен просрочен')
        }

        const user = await this.prismaService.user.update({
            where: { id: existingToken.userId! },
            data: { isEmailVerified: true }
        })

        await this.prismaService.token.delete({
            where: { id: existingToken.id, type: TokenType.EMAIL_VERIFICATION }
        })

        const metaData = getSessionMetadata(req, userAgent)
        return saveSession(req, user, metaData)
    }

    public async sendVeryficationToken(user: User) {
        await generateToken(
            this.prismaService,
            user,
            TokenType.EMAIL_VERIFICATION,
            true
        )

        return true
    }
}
