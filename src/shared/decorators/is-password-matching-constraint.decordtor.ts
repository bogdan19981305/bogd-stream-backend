import type {
    ValidationArguments,
    ValidatorConstraintInterface
} from 'class-validator'
import { ValidatorConstraint } from 'class-validator'

import { NewPasswordInput } from '@/modules/auth/password-recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatchingConstraint
    implements ValidatorConstraintInterface
{
    public validate(passwordRepeat: string, args: ValidationArguments) {
        const object = args.object as NewPasswordInput
        const password = object.password
        return passwordRepeat === password
    }

    public defaultMessage() {
        return 'Пароли не совпадают'
    }
}
