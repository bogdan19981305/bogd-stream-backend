import * as React from 'react'
import { type SessionMetadata } from '@/shared/types/session-metadata.types'
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

interface DeactivateTemplateProps {
    token: string
    metadata: SessionMetadata
}

export const DeactivateTemplate = ({
     token,
     metadata
 }: DeactivateTemplateProps) => {
    return (
        <Html>
            <Head>
                <title>Деактивация аккаунта</title>
            </Head>
            <Preview>Запрос на деактивацию аккаунта</Preview>
            <Tailwind>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            Деактивация аккаунта
                        </Heading>
                        <Text className="text-base text-black">
                            Вы инициировали процесс деактивации аккаунта.
                        </Text>
                    </Section>
                    <Section className="bg-gray-100 rounded-lg p-6 text-center mb-6">
                        <Heading className="text-2xl text-black font-semibold">
                            Код подтверждения
                        </Heading>
                        <Heading className="text-3xl text-black font-semibold">
                            {token}
                        </Heading>
                        <Text className="text-gray">
                            Етот код будет действителен в течении 5 минут
                        </Text>
                    </Section>

                    <Section className="text-center mt-8">
                        <Heading className="text-2xl text-black font-bold">
                            Информация о сессии
                        </Heading>
                        <Text className="text-gray-600">
                            IP-адрес: {metadata.ip}
                        </Text>
                        <Text className="text-gray-600">
                            Устройство: {metadata.device.type}
                        </Text>
                        <Text className="text-gray-600">
                            Браузер: {metadata.device.browser}
                        </Text>
                        <Text className="text-gray-600">
                            Операционная система: {metadata.device.os}
                        </Text>
                    </Section>

                    <Section className="text-center mt-8">
                        <Text className="text-gray-600">
                            Местоположение: {metadata.location.city}, {metadata.location.country}
                        </Text>
                    </Section>

                    <Section className="text-center mt-8">
                        <Text className="text-gray-600">
                            Если у вас есть вопросы или вы столкнулись с проблемами, не стесняйтесь обращаться в нашу службу поддержки по адресу {' '}
                            <Link href="mailto:litvinenkob16@gmail.com">
                                litvinenkob16@gmail.com
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}