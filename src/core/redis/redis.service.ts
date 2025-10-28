import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit
} from '@nestjs/common'
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

        this.client.on('error', err => Logger.error('❌ Redis Error:', err))

        await this.client.connect()
        Logger.log('✅ Redis connected')
    }

    async onModuleDestroy() {
        await this.client?.quit()
        Logger.log('🧹 Redis connection closed')
    }

    getClient(): RedisClientType {
        return this.client
    }

    set(key: string, value: string, ttl?: number) {
        return this.client.set(key, value, ttl ? { EX: ttl } : undefined)
    }

    get(key: string) {
        return this.client.get(key)
    }

    async keys(pattern: string): Promise<string[]> {
        return await this.client.keys(pattern)
    }

    async del(key: string): Promise<boolean> {
        const result = await this.client.del(key)
        return result > 0
    }
}
