/** @type {import('tailwindcss').Config} */
export default {
   content: [
      './app/components/**/*.{js,vue,ts}',
      './app/layouts/**/*.vue',
      './app/pages/**/*.vue',
      './app/plugins/**/*.{js,ts}',
      './app/app.vue',
      './app/error.vue',
   ],
   darkMode: 'selector',
   theme: {
      extend: {
         screens: {
            'uxs': '480px',
            'xs': '480px',
            '3xl': '1920px',
            'uxl': '2240px',
         },
         colors: {
            /* hsl(220, 9%, 94%) */
            primary: {
               100: 'hsl(220, 9%, 94%)',
               200: 'hsl(220, 9%, 84%)',
               300: 'hsl(220, 9%, 74%)',
               400: 'hsl(220, 9%, 64%)',
               500: 'hsl(220, 9%, 54%)',
               600: 'hsl(220, 9%, 44%)',
               700: 'hsl(220, 9%, 34%)',
               800: 'hsl(220, 9%, 24%)',
               900: 'hsl(220, 9%, 14%)',
            },
            /* hsl(0, 0%, 98%) */
            secondary: {
               100: 'hsl(0, 0%, 98%)',
               200: 'hsl(0, 0%, 88%)',
               300: 'hsl(0, 0%, 78%)',
               400: 'hsl(0, 0%, 68%)',
               500: 'hsl(0, 0%, 58%)',
               600: 'hsl(0, 0%, 48%)',
               700: 'hsl(0, 0%, 38%)',
               800: 'hsl(0, 0%, 28%)',
               900: 'hsl(0, 0%, 18%)',
            },
            /* hsl(225, 88%, 16%) */
            accent: {
               100: 'hsl(225, 88%, 96%)',
               200: 'hsl(225, 88%, 86%)',
               300: 'hsl(225, 88%, 76%)',
               400: 'hsl(225, 88%, 66%)',
               500: 'hsl(225, 88%, 56%)',
               600: 'hsl(225, 88%, 46%)',
               700: 'hsl(225, 88%, 36%)',
               800: 'hsl(225, 88%, 26%)',
               900: 'hsl(225, 88%, 16%)',
            },
            basic: {
               100: 'hsl(0, 0%, 90%)',
               200: 'hsl(0, 0%, 80%)',
               300: 'hsl(0, 0%, 70%)',
               400: 'hsl(0, 0%, 60%)',
               500: 'hsl(0, 0%, 50%)',
               600: 'hsl(0, 0%, 40%)',
               700: 'hsl(0, 0%, 30%)',
               800: 'hsl(0, 0%, 20%)',
               900: 'hsl(0, 0%, 10%)',
            },
         },
         fontFamily: {
            primary: ['"EB Garamond"'],
            // title: ['"Jost"']
         },
         fontSize: {
            xxs: ['clamp(0.7rem, 0.8vw, 0.694rem)', '1.1'],
            xs: ['clamp(0.8rem, 0.9vw, 0.833rem)', '1.1'],
            sm: ['clamp(0.9rem, 1vw, 1rem)', '1.1'],
            base: ['clamp(1rem, 1.1vw, 1.2rem)', '1.15'],
            lg: ['clamp(1.1rem, 1.3vw, 1.44rem)', '1.1'],
            xl: ['clamp(1.2rem, 1.5vw, 1.728rem)', '1.1'],
            '2xl': ['clamp(1.3rem, 1.7vw, 2.074rem)', '1.3'],
            '3xl': ['clamp(1.4rem, 1.9vw, 2.488rem)', '1.3'],
            '4xl': ['clamp(1.5rem, 2vw, 2.986rem)', '1.3'],
            '5xl': ['clamp(2.28rem, calc(0.94rem + 6.71vw), 5.72rem)', '1.3'],
            '6xl': ['clamp(2.57rem, calc(0.78rem + 8.95vw), 7.15rem)', '1.3'],
         },
      },
   },
   plugins: [],
}