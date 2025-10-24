import {
    type CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { PrismaService } from '@/core/prisma/prisma.service'
import type { GqlContext } from '@/shared/types/gql-context.types'

@Injectable()
export class GqlAuthGuard implements CanActivate {
    public constructor(private readonly prismaService: PrismaService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const { req } = ctx.getContext<GqlContext>()

        const userId = req.session?.userId
        if (!userId) {
            throw new UnauthorizedException('Пользователь не авторизован')
        }

        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new UnauthorizedException('Пользователь не найден')
        }

        ;(req as unknown as Request & { user: typeof user }).user = user

        return true
    }
}
