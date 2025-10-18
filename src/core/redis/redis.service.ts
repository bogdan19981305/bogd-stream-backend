import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: RedisClientType

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        this.client = createClient({
            url: this.configService.getOrThrow<string>(
                'REDIS_URI',
                'redis://localhost:6379'
            )
        })

        this.client.on('error', err => console.error('❌ Redis Error:', err))

        await this.client.connect()
        console.log('✅ Redis connected')
    }

    async onModuleDestroy() {
        await this.client?.quit()
        console.log('🧹 Redis connection closed')
    }

    getClient(): RedisClientType {
        return this.client
    }

    async set(key: string, value: string, ttl?: number) {
        await this.client.set(key, value, ttl ? { EX: ttl } : undefined)
    }

    async get(key: string) {
        return this.client.get(key)
    }

    async del(key: string) {
        await this.client.del(key)
    }
}
