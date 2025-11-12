import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Length } from 'class-validator'

@InputType({ description: 'Enable TOTP input' })
export class EnableTotpInput {
    @Field(() => String, { description: 'User secret' })
    @IsNotEmpty()
    @IsString()
    public secret: string

    @Field(() => String, { description: 'User code' })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    public pin: string
}
