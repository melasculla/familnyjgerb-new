export const usePagination = (_perPage: number, stateOrQueryName: string = 'page') => {
   const route = useRoute()
   const perPage = _perPage
   const totaItems = ref<number>(0)

   const currentPageState = useState<number>(stateOrQueryName, () => 1)
   const currentPageQuery = computed<number>(() => route.query[stateOrQueryName] ? +route.query[stateOrQueryName] : 1)

   const pages = computed<number>(() => Math.ceil(totaItems.value / perPage))

   return { perPage, currentPageState, currentPageQuery, pages, totaItems }
}