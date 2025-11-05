import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType({ description: 'Reset password input' })
export class ResetPasswordInput {
    @Field(() => String, { description: 'Email' })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    public email: string
}
