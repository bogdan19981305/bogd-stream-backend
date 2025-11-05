import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/shared/types/gql-context.types'

import { NewPasswordInput } from './inputs/new-password.input'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { PasswordRecoveryService } from './password-recovery.service'

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
    public constructor(
        private readonly passwordRecoveryService: PasswordRecoveryService
    ) {}

    @Mutation(() => Boolean, {
        name: 'resetPasswordByEmail',
        description: 'Сбросить пароль по email'
    })
    public async resetPassword(
        @Args('data') input: ResetPasswordInput,
        @Context() { req }: GqlContext,
        @UserAgent() userAgent: string
    ) {
        return this.passwordRecoveryService.resetPassword(input, req, userAgent)
    }

    @Mutation(() => Boolean, {
        name: 'newPassword',
        description: 'Установить новый пароль'
    })
    public async newPassword(@Args('data') input: NewPasswordInput) {
        return this.passwordRecoveryService.newPassword(input)
    }
}
