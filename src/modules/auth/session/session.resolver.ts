import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthModel } from '@/modules/auth/account/models/auth.model'
import { SessionModel } from '@/modules/auth/session/models/session.model'
import { Authorization } from '@/shared/decorators/auth.decorator'
import { UserAgent } from '@/shared/decorators/user-agent.decorator'
import type { GqlContext } from '@/shared/types/gql-context.types'

import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
    public constructor(private readonly sessionService: SessionService) {}

    @Authorization()
    @Query(() => [SessionModel], { name: 'findSessionsByUser' })
    public async findByUser(@Context() { req }: GqlContext) {
        return this.sessionService.findByUser(req)
    }

    @Authorization()
    @Query(() => SessionModel, { name: 'findCurrentUserSession' })
    public async findCurrent(@Context() { req }: GqlContext): Promise<any> {
        return this.sessionService.findCurrent(req)
    }

    @Mutation(() => AuthModel, {
        name: 'login',
        description: 'Login user'
    })
    public async login(
        @Context() { req }: GqlContext,
        @Args('data') input: LoginInput,
        @UserAgent() userAgent: string
    ) {
        return this.sessionService.login(req, input, userAgent)
    }

    @Authorization()
    @Mutation(() => Boolean, {
        name: 'logout',
        description: 'Logout user'
    })
    public async logout(@Context() { req }: GqlContext) {
        return this.sessionService.logout(req)
    }

    @Mutation(() => Boolean, {
        name: 'clearSessionCookie'
    })
    public clearSession(@Context() { req }: GqlContext) {
        return this.sessionService.clearSession(req)
    }

    @Authorization()
    @Mutation(() => Boolean, {
        name: 'removeSession'
    })
    public remove(
        @Context() { req }: GqlContext,
        @Args('sessionId') sessionId: string
    ) {
        return this.sessionService.remove(req, sessionId)
    }
}
