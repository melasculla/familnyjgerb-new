import { type MultiPartData } from 'h3'

export type FileEntityType = {
   file: MultiPartData,
   acceptedTypes?: string[]
}

export class FileEntity {
   private allowedSize = 1024 * 1024 * 5 // 5 Mb
   private initialFilename
   private acceptedTypes
   public filename
   public extenstion
   public type
   public data

   constructor({ file, acceptedTypes = ['image/'] }: FileEntityType) {
      this.acceptedTypes = acceptedTypes || []

      this.initialFilename = file.filename || file.name
      this.data = file.data
      this.checkSize()

      this.extenstion = this.exctractType(file.type)
      this.type = file.type!
      this.checkFileType()

      this.filename = this.genereateRandomSuffix()
   }

   private genereateRandomSuffix(): string {
      if (!this.initialFilename)
         return String(Math.floor(Math.random() * 9e15)) + '.' + this.extenstion

      const extension = this.initialFilename.split('.').pop();
      const name = this.initialFilename.split('.').slice(0, -1).join('.').replaceAll(':', '');
      const newName = name + '__' + String(Math.floor(Math.random() * 9e15)) + '.' + extension
      return newName
   }

   private exctractType(string?: string) {
      const regex = /\/([a-z0-9\+-]+)$/;
      if (!string)
         throw createError({ statusCode: 400, message: `File doesnt have extension` })

      const match = string.match(regex)
      return (match && match[1]) ? match[1] : createError({ statusCode: 400, message: `File doesnt have extension` })
   }

   private checkFileType() {
      const isAccepted = this.acceptedTypes.some(type => this.type.startsWith(type))
      if (!isAccepted)
         throw createError({ statusCode: 400, message: `File have wrong extension` })
   }

   private checkSize() {
      const isAllowedSize = this.data.length <= this.allowedSize
      if (!isAllowedSize)
         throw createError({
            statusCode: 400,
            message: `File ${this.initialFilename} too big (${(this.data.length / 1024 / 1024).toFixed(2)}Mb)`
         })
   }
}