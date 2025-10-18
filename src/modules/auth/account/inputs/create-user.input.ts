import { InputType } from '@nestjs/graphql'
import { Field } from '@nestjs/graphql'
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength
} from 'class-validator'

@InputType({ description: 'Create user input' })
export class CreateUserInput {
    @Field(() => String, { description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    public email: string

    @Field(() => String, { description: 'User password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    public password: string

    @Field(() => String, { description: 'User username' })
    @IsNotEmpty()
    @IsString()
    public username: string

    @Field(() => String, { description: 'User display name' })
    @IsNotEmpty()
    @IsString()
    public displayName: string

    @Field(() => String, { description: 'User avatar', nullable: true })
    @IsUrl()
    @IsOptional()
    public avatar?: string

    @Field(() => String, { description: 'User bio', nullable: true })
    @IsString()
    @IsOptional()
    public bio?: string
}
