import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization } from '@/shared/decorators/auth.decorator'
import { Authorized } from '@/shared/decorators/authorized.decorator'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './models/user.model'

@Resolver('User')
export class AccountResolver {
    public constructor(private readonly accountService: AccountService) {}

    @Query(() => [UserModel], { name: 'findAllUsers' })
    public async findAll(): Promise<UserModel[]> {
        return this.accountService.findAll()
    }

    @Authorization()
    @Query(() => UserModel, { name: 'getProfile' })
    public async me(@Authorized('id') id: string): Promise<UserModel> {
        return this.accountService.me(id)
    }

    @Mutation(() => Boolean, {
        name: 'createUser',
        description: 'Create a new user'
    })
    public async create(
        @Args('input', { type: () => CreateUserInput }) input: CreateUserInput
    ): Promise<boolean> {
        return this.accountService.create(input)
    }
}
