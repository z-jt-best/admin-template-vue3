export const sizeEnum = {
    XS: 'XS',
    SM: 'SM',
    MD: 'MD',
    LG: 'LG',
    XL: 'XL',
    XXL: 'XXL'
}

export const screenEnum = {
    XS: 480,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1600
}

const screenMap = new Map()

screenMap.set(sizeEnum.XS, screenEnum.XS)
screenMap.set(sizeEnum.SM, screenEnum.SM)
screenMap.set(sizeEnum.MD, screenEnum.MD)
screenMap.set(sizeEnum.LG, screenEnum.LG)
screenMap.set(sizeEnum.XL, screenEnum.XL)
screenMap.set(sizeEnum.XXL, screenEnum.XXL)

export { screenMap }
