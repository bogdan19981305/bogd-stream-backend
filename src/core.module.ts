import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { getGraphQLConfig } from './core/config/graphql.config'
import { PrismaModule } from './core/prisma/prisma.module'
import { RedisModule } from './core/redis/redis.module'
import { AccountModule } from './modules/auth/account/account.module'
import { SessionModule } from './modules/auth/session/session.module'
import { IS_DEV_ENV } from './shared/utils/is-dev.util'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: !IS_DEV_ENV
        }),
        PrismaModule,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: getGraphQLConfig,
            imports: [ConfigModule],
            inject: [ConfigService]
        }),
        RedisModule,
        AccountModule,
        SessionModule
    ]
})
export class CoreModule {}
