import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import { type Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { RedisService } from '@/core/redis/redis.service'
import { getSessionMetadata } from '@/shared/utils/session-metadata.utils'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService
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
                        id: (key ?? '').split(':')?.[1] as string,
                        createdAt: session.createdAt
                            ? new Date(session.createdAt)
                            : new Date()
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
            `${sessionFolder}:${sessionId}`
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

        const metaData = getSessionMetadata(req, userAgent)

        return new Promise((resolve, reject) => {
            req.session.createdAt = new Date()
            req.session.userId = user.id
            req.session.metadata = metaData

            req.session.save(err => {
                if (err) {
                    console.error('Session save error:', err)
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось сохранить сессию'
                        )
                    )
                }
                resolve(user)
            })
        })
    }

    public async logout(req: Request) {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось удалить сессию'
                        )
                    )
                }
                req.res?.clearCookie(
                    this.configService.getOrThrow<string>('SESSION_NAME')
                )
                resolve(true)
            })
        })
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

        await this.redisService.del(`${sessionFolder}:${sessionId}`)

        return true
    }
}
