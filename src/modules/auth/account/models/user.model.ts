import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'User model' })
export class UserModel {
    @Field(() => ID, { description: 'User ID' })
    public id: string

    @Field(() => String, { description: 'User email' })
    public email: string

    @Field(() => String, { description: 'User password' })
    public password: string

    @Field(() => Date, { description: 'User created at' })
    public createdAt: Date

    @Field(() => Date, { description: 'User updated at' })
    public updatedAt: Date

    @Field(() => String, { description: 'User username' })
    public username: string

    @Field(() => String, { description: 'User display name' })
    public displayName: string

    @Field(() => String, { description: 'User avatar', nullable: true })
    public avatar: string | null

    @Field(() => String, { description: 'User bio', nullable: true })
    public bio: string | null
}
