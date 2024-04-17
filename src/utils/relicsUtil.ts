import rarityEnum from "./enums/rarity";

export const getRelicGradient = (rarity: rarityEnum | 'default') => {
    return {
        'Normal': 'radial-gradient(50% 50% at 50% 50%, #CFDFFF 0%, #719DF6 100%)',
        'Lendário': 'radial-gradient(50% 50% at 50% 50%, #EBD8F8 0%, #A344E8 100%)',
        'Místico':  'radial-gradient(50% 50% at 50% 50%, #F4E9D1 0%, #F0C05D 100%)',
        'default': '#D9D9D9',
    }[rarity]
}

export const getRelicColor = (rarity: rarityEnum) => {
    return {
		'Normal': '#719DF6',
		'Lendário': '#A344E8',
		'Místico':  '#F0C05D',
	}[rarity]
}
