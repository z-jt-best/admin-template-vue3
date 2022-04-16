const plugin = require('tailwindcss/plugin')

module.exports = {
    purge: {
        content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
        safelist: ['grid-cols-4', 'grid-cols-6', 'grid-cols-8', 'grid-cols-10']
    },
    darkMode: false,
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1600px'
        },
        extend: {
            colors: {
                primary: '#0960bd'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: [plugin(createEnterPlugin())]
}

function createEnterPlugin(maxOutput = 7) {
    const createCss = (index, d = 'x') => {
        const upd = d.toUpperCase()
        return {
            [`*> .enter-${d}:nth-child(${index})`]: {
                transform: `translate${upd}(50px)`
            },
            [`*> .-enter-${d}:nth-child(${index})`]: {
                transform: `translate${upd}(-50px)`
            },
            [`* > .enter-${d}:nth-child(${index}),* > .-enter-${d}:nth-child(${index})`]: {
                'z-index': `${10 - index}`,
                opacity: '0',
                animation: `enter-${d}-animation 0.4s ease-in-out 0.3s`,
                'animation-fill-mode': 'forwards',
                'animation-delay': `${(index * 1) / 10}s`
            }
        }
    }

    const handler = ({ addUtilities }) => {
        const addRawCss = {}
        for (let index = 1; index < maxOutput; index++) {
            Object.assign(addRawCss, {
                ...createCss(index, 'x'),
                ...createCss(index, 'y')
            })
        }
        addUtilities({
            ...addRawCss,
            [`@keyframes enter-x-animation`]: {
                to: {
                    opacity: '1',
                    transform: 'translateX(0)'
                }
            },
            [`@keyframes enter-y-animation`]: {
                to: {
                    opacity: '1',
                    transform: 'translateY(0)'
                }
            }
        })
    }

    return handler
}
