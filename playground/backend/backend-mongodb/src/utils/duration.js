export const parseDuration = (value) => {

    const regx = /^(\d+)(ms|s|m|h|d)$/
    const matched = value.match(regx)
    
    if(matched == null) throw new Error('invalid values')

    const digit = Number(matched[1])
    const unit = matched[2]

    const multipliers = {
    ms: 1,
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000
    }

    const val = digit * multipliers[unit]

    return val


} 