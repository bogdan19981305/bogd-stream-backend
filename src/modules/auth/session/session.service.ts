import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import { type Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {}

    public async login(req: Request, input: LoginInput) {
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

        return new Promise((resolve, reject) => {
            req.session.createdAt = new Date()
            req.session.userId = user.id

            console.log(req.session)

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
                resolve({ success: true })
            })
        })
    }
}
