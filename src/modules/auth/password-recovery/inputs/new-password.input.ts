import { Field, InputType } from '@nestjs/graphql'
import {
    IsNotEmpty,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
    Validate
} from 'class-validator'

import { IsPasswordMatchingConstraint } from '@/shared/decorators/is-password-matching-constraint.decordtor'

@InputType({ description: 'New password input' })
export class NewPasswordInput {
    @Field(() => String, { description: 'New password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    public password: string

    @Field(() => String, { description: 'Confirm password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Validate(IsPasswordMatchingConstraint)
    public passwordRepeat: string

    @Field(() => String, { description: 'Token' })
    @IsNotEmpty()
    @IsString()
    @IsUUID('4')
    public token: string
}
