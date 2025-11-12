import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TotpModel {
    @Field(() => String, { description: 'QR code url' })
    public qrcodeUrl: string

    @Field(() => String, { description: 'QR code secret' })
    public secret: string
}
