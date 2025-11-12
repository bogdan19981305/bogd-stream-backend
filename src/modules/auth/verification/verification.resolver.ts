import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { AuthModel } from '@/modules/auth/account/models/auth.model'
import { UserAgent } from '@/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/shared/types/gql-context.types'

import { VerificationInput } from './inputs/verification.input'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
    public constructor(
        private readonly verificationService: VerificationService
    ) {}

    @Mutation(() => AuthModel, {
        name: 'verifyEmail',
        description: 'Verify email'
    })
    public async verify(
        @Context() { req }: GqlContext,
        @Args('data') input: VerificationInput,
        @UserAgent() userAgent: string
    ) {
        return this.verificationService.verifyEmailToken(input, req, userAgent)
    }
}
