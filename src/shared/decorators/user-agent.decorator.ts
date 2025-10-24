import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const UserAgent = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): string => {
        if (ctx.getType() === 'http') {
            const req = ctx.switchToHttp().getRequest<Request>()
            return (req.headers['user-agent'] as string) ?? ''
        }

        const gql = GqlExecutionContext.create(ctx)
        const { req } = gql.getContext<{ req: Request }>()
        return (req?.headers?.['user-agent'] as string) ?? ''
    }
)
