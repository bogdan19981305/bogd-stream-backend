import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType({ description: 'Login user input' })
export class LoginInput {
    @Field(() => String, { description: 'User login' })
    @IsString()
    @IsNotEmpty()
    public login: string

    @Field(() => String, { description: 'User password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    public password: string
}
