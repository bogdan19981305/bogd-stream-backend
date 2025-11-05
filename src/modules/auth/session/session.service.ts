import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import { type Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { RedisService } from '@/core/redis/redis.service'
import { VerificationService } from '@/modules/auth/verification/verification.service'
import { getSessionMetadata } from '@/shared/utils/session-metadata.utils'
import { destroySession, saveSession } from '@/shared/utils/session.util'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly verificationService: VerificationService
    ) {}

    public async findByUser(req: Request) {
        const userId = req.session.userId

        if (!userId) {
            throw new UnauthorizedException('Пользователь не авторизован')
        }

        const keys = await this.redisService.keys('*')

        const userSessions: unknown[] = []

        for (const key of (keys ?? []) as any) {
            const sessionData = await this.redisService.get(key)

            if (sessionData) {
                const session = JSON.parse(sessionData)

                if (session.userId === userId) {
                    userSessions.push({
                        ...session,
                        id: (key ?? '').split(':')?.[1] as string
                    })
                }
            }
        }

        return userSessions.filter(
            (session: any) => session.id !== req.session.id
        )
    }

    public async findCurrent(req: Request): Promise<any> {
        const sessionId = req.session.id

        const sessionFolder =
            this.configService.getOrThrow<string>('SESSION_FOLDER')

        const sessionData = await this.redisService.get(
            `${sessionFolder}${sessionId}`
        )

        const session = JSON.parse(sessionData || '{}')

        return {
            ...session,
            id: sessionId
        }
    }

    public async login(req: Request, input: LoginInput, userAgent: string) {
        const { login, password } = input

        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { username: { equals: login } },
                    { email: { equals: login } }
                ]
            }
        })

        if (!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        const isPasswordValid = await argon2.verify(user.password, password)

        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный пароль')
        }

        if (!user.isEmailVerified) {
            await this.verificationService.sendVeryficationToken(user)
            throw new BadRequestException(
                'Пожалуйста, подтвердите вашу почту. На ваш email была отправлена ссылка для верификации.'
            )
        }

        const metaData = getSessionMetadata(req, userAgent)

        return saveSession(req, user, metaData)
    }

    public async logout(req: Request) {
        return destroySession(req, this.configService)
    }

    public clearSession(req: Request): boolean {
        req.res?.clearCookie(
            this.configService.getOrThrow<string>('SESSION_NAME')
        )
        return true
    }

    public async remove(req: Request, sessionId: string): Promise<boolean> {
        if (req.session.id === sessionId) {
            throw new ConflictException('Невозможно удалить текущую сессию')
        }

        const sessionFolder =
            this.configService.getOrThrow<string>('SESSION_FOLDER')

        return this.redisService.del(`${sessionFolder}${sessionId}`)
    }
}
