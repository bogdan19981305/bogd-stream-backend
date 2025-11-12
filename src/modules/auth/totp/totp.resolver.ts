import { User } from '@generated/prisma'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { EnableTotpInput } from '@/modules/auth/totp/inputs/enable-totp.input'
import { TotpModel } from '@/modules/auth/totp/models/totp.model'
import { Authorization } from '@/shared/decorators/auth.decorator'
import { Authorized } from '@/shared/decorators/authorized.decorator'

import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
    constructor(private readonly totpService: TotpService) {}

    @Authorization()
    @Query(() => TotpModel, { name: 'generateTOTPSecret' })
    public async generate(@Authorized() user: User) {
        return this.totpService.generate(user)
    }

    @Authorization()
    @Mutation(() => Boolean, { name: 'enableTOTP' })
    public async enable(
        @Authorized() user: User,
        @Args('data') input: EnableTotpInput
    ) {
        return this.totpService.enable(user, input)
    }

    @Authorization()
    @Mutation(() => Boolean, { name: 'disableTOTP' })
    public async disable(@Authorized() user: User) {
        return this.totpService.disable(user)
    }
}
