import * as React from 'react'
import { type SessionMetadata } from '@/shared/types/session-metadata.types'
import { Head, Preview, Html, Link, Section, Tailwind, Heading, Body, Text } from '@react-email/components'

interface PasswordRecoveryTemplateProps {
    domain: string
    token: string
    metadata: SessionMetadata
}

export const PasswordRecoveryTemplate = ({
    domain,
    token,
    metadata
}: PasswordRecoveryTemplateProps) => {
    const resetPasswordUrl = `${domain}/account/recovery?token=${token}`
    return (
        <Html>
            <Head>
                <title>Сброс пароля</title>
            </Head>
            <Preview>Сброс пароля</Preview>
            <Tailwind>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            Сброс пароля
                        </Heading>
                        <Text className="text-base text-black">
                            Пожалуйста, нажмите на ссылку ниже, чтобы сбросить пароль.
                        </Text>
                        <Link href={resetPasswordUrl} className="inline-flex justify-center items-center rounded-md text-sm font-medium text-white bg-[#18B9AE] px-5 py-2">
                            Сбросить пароль
                        </Link>
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