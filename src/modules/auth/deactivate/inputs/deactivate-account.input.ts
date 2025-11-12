import { Field, InputType } from '@nestjs/graphql'
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    MaxLength,
    MinLength
} from 'class-validator'

@InputType({ description: 'Deactivation account data' })
export class DeactivateAccountInput {
    @Field(() => String, { description: 'Account deactivated email' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string

    @Field(() => String, { description: 'User password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    public password: string

    @Field(() => String, { nullable: true, description: 'TOTP pin-code' })
    @IsString()
    @IsOptional()
    @Length(6, 6)
    public pin?: string | null
}
