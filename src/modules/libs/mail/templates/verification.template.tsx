import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

interface VerificationTemplateProps {
    domain: string
    token: string
}

export const VerificationTemplate = ({
    domain,
    token
}: VerificationTemplateProps) => {
    const verifyUrl = `${domain}/account/verify?token=${token}`

    return(
        <Html>
            <Head>
                <title>Верификация аккаунта</title>
            </Head>
            <Preview>Верификация аккаунта</Preview>
            <Tailwind>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            Подтверждение вашей почты
                        </Heading>
                        <Text className="text-base text-black">
                            Спасибо за регистрацию в BogdStream! Пожалуйста, подтвердите вашу почту, нажав на ссылку ниже.
                        </Text>
                        <Link href={verifyUrl} className="inline-flex justify-center items-center rounded-md text-sm font-medium text-white bg-[#18B9AE] px-5 py-2">
                            Подтвердить почту
                        </Link>
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
    );
}

export default VerificationTemplate
