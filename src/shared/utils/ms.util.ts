const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365

type Unit =
    | 'Years'
    | 'Year'
    | 'Yrs'
    | 'Yr'
    | 'Y'
    | 'Months'
    | 'Month'
    | 'Mos'
    | 'Mo'
    | 'M'
    | 'Weeks'
    | 'Week'
    | 'Wks'
    | 'Wk'
    | 'W'
    | 'Days'
    | 'Day'
    | 'D'
    | 'Hours'
    | 'Hour'
    | 'Hr'
    | 'H'
    | 'Minutes'
    | 'Minute'
    | 'Mins'
    | 'Min'
    | 'Seconds'
    | 'Second'
    | 'Sec'
    | 'S'
    | 'Milliseconds'
    | 'Millisecond'
    | 'Msecs'
    | 'Ms'
    | 'Microseconds'
    | 'Microsecond'
    | 'Micros'
    | 'Micro'
    | 'Nanoseconds'

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

export type StringValue =
    | `${number}`
    | `${number}${UnitAnyCase}`
    | `${number} ${UnitAnyCase}`

export function ms(str: StringValue): number {
    if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
        throw new Error(
            'Value provided to ms() must be a string with length between 1 and 99'
        )
    }

    const match =
        /^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
            str
        )

    const groups = match?.groups as { value: string; type?: string } | undefined

    if (!groups) {
        return NaN
    }

    const n = parseFloat(groups.value)
    const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>

    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y
        case 'months':
        case 'month':
        case 'mos':
        case 'mo':
        case 'm':
            return n * m
        case 'weeks':
        case 'week':
        case 'wks':
        case 'wk':
        case 'w':
            return n * w
        case 'days':
        case 'day':
        case 'd':
            return n * d
        case 'hours':
        case 'hour':
        case 'hr':
        case 'h':
            return n * h
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
            return n * m
        case 'seconds':
        case 'second':
        case 'sec':
        case 's':
            return n * s
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'ms':
            return n * s
        case 'microseconds':
        case 'microsecond':
        case 'micros':
        case 'micro':
            return n * s
        case 'nanoseconds':
            return n * s
        default:
            throw new Error(`Invalid unit: ${type as string}`)
    }
}
