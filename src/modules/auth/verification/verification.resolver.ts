import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/shared/types/gql-context.types'

import { UserModel } from '../account/models/user.model'
import { VerificationInput } from './inputs/verification.input'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
    public constructor(
        private readonly verificationService: VerificationService
    ) {}

    @Mutation(() => UserModel, {
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
