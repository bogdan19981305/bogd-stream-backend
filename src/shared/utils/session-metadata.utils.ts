import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'
import { LocaleData } from 'i18n-iso-countries'
import DeviceDetector from 'node-device-detector'

import { SessionMetadata } from '@/shared/types/session-metadata.types'
import { IS_DEV_ENV } from '@/shared/utils/is-dev.util'

countries.registerLocale(
    require('i18n-iso-countries/langs/en.json') as LocaleData
)

export function getSessionMetadata(
    req: Request,
    userAgent: string
): SessionMetadata {
    const ip = IS_DEV_ENV
        ? '216.243.32.14'
        : Array.isArray(req.headers['cf-connecting-ip'])
          ? req.headers['cf-connecting-ip'][0]
          : req.headers['cf-connecting-ip'] || req.ip || ''

    const detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        osIndexes: true,
        deviceAliasCode: false,
        deviceTrusted: false,
        deviceInfo: false,
        maxUserAgentSize: 500
    })
    const detectorResult = detector.detect(userAgent)
    const location = lookup(ip)

    return {
        location: {
            country:
                countries.getName(location?.country ?? '', 'en') ?? 'Unknown',
            city: location?.city ?? 'Unknown',
            longitude: location?.ll ? location.ll[1] : 0,
            latitude: location?.ll ? location.ll[0] : 0
        },
        device: {
            browser: detectorResult?.client?.name ?? 'Unknown',
            os: detectorResult?.os?.name ?? 'Unknown',
            type: detectorResult?.client?.type ?? 'Unknown'
        },
        ip
    }
}
