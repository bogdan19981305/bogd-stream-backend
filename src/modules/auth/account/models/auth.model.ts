import { Field, ObjectType } from '@nestjs/graphql'

import { UserModel } from '@/modules/auth/account/models/user.model'

@ObjectType()
export class AuthModel {
    @Field(() => UserModel, { nullable: true, description: 'user model' })
    public user: UserModel

    @Field(() => String, { nullable: true, description: 'info message' })
    public message: string
}
