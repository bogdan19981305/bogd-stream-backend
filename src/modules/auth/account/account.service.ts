import { ConflictException, Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'

import { PrismaService } from '@/core/prisma/prisma.service'

import { CreateUserInput } from './inputs/create-user.input'

@Injectable()
export class AccountService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findAll() {
        return this.prismaService.user.findMany()
    }

    public async create(input: CreateUserInput): Promise<boolean> {
        const { email, password, username, displayName, avatar, bio } = input

        const isUsernameExists = await this.prismaService.user.findUnique({
            where: {
                username
            }
        })

        if (isUsernameExists) {
            throw new ConflictException('Такой username уже занят')
        }

        const isEmailExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (isEmailExists) {
            throw new ConflictException('Такой email уже занят')
        }
        const hashedPassword = await argon2.hash(password)

        await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                displayName,
                avatar,
                bio
            }
        })

        return true
    }
}
