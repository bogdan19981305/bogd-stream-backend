import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

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
