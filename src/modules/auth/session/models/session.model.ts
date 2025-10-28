import { Field, Float, ObjectType } from '@nestjs/graphql'

import {
    DeviceInfo,
    LocationInfo,
    SessionMetadata
} from '@/shared/types/session-metadata.types'

@ObjectType()
export class LocationModel implements LocationInfo {
    @Field(() => String)
    country!: string

    @Field(() => String)
    city!: string

    @Field(() => Float)
    longitude!: number

    @Field(() => Float)
    latitude!: number
}

@ObjectType()
export class DeviceModel implements DeviceInfo {
    @Field(() => String)
    type!: string

    @Field(() => String)
    os!: string

    @Field(() => String)
    browser!: string
}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
    @Field(() => String, { nullable: true })
    ip: string

    @Field(() => LocationModel, { nullable: true })
    location: LocationModel

    @Field(() => DeviceModel, { nullable: true })
    device: DeviceModel
}

@ObjectType()
export class SessionModel {
    @Field(() => String)
    id!: string

    @Field(() => String, { nullable: true })
    userId!: string

    @Field(() => String, { nullable: true })
    createdAt?: string

    @Field(() => SessionMetadataModel, { nullable: true })
    metadata?: SessionMetadataModel
}
