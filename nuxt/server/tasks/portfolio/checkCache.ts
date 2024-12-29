export default defineTask({
   meta: {
      name: 'portfolio:update',
      description: 'Updating portfolio in redis from DB',
   },
   async run({ payload, context }) {
      // const portfolio = await portfolioModel().getPortfolio()
      // const cachedPortfolio = await useStorage('redis:portfolio').getItem('portfolio') as Portfolio[]
      // const isListEqual = JSON.stringify(portfolio) === JSON.stringify(cachedPortfolio)

      // if (isListEqual) {
      //    console.info('Posts Cache is Valid')
      //    return { result: 'Cache is Valid' };
      // }

      // await useStorage('redis:portfolio').setItem('portfolio', portfolio)
      // console.info('Posts Cache was upated')
      return { result: 'Cache was upated' };
   },
})