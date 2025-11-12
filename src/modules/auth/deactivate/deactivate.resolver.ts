import { User } from '@generated/prisma'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { AuthModel } from '@/modules/auth/account/models/auth.model'
import { DeactivateAccountInput } from '@/modules/auth/deactivate/inputs/deactivate-account.input'
import { Authorization } from '@/shared/decorators/auth.decorator'
import { Authorized } from '@/shared/decorators/authorized.decorator'
import { UserAgent } from '@/shared/decorators/user-agent.decorator'
import type { GqlContext } from '@/shared/types/gql-context.types'

import { DeactivateService } from './deactivate.service'

@Resolver('Deactivate')
export class DeactivateResolver {
    constructor(private readonly deactivateService: DeactivateService) {}

    @Authorization()
    @Mutation(() => AuthModel, {
        name: 'deactivateAccount',
        description: 'Deactivate user'
    })
    public async deactivate(
        @Context() { req }: GqlContext,
        @Args('data') input: DeactivateAccountInput,
        @Authorized() user: User,
        @UserAgent() userAgent: string
    ) {
        return this.deactivateService.deactivate(req, input, user, userAgent)
    }
}
