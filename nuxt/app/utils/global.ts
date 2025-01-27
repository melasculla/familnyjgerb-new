export const deepClone = <T>(data: T): T => {
   try {
      return JSON.parse(JSON.stringify(data))
   }
   catch (err: any) {
      console.warn(err)
      return data
   }
}