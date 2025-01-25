export type ProjectErrors = {
   slug: string
   title: string
   description: string
}

export type PostErrors = {
   slug: string
   title: string
   description: string,
   category: string
}

export const PROVIDE_KEYS = {
   projectErrors: Symbol() as InjectionKey<ProjectErrors>,
   postErrors: Symbol() as InjectionKey<PostErrors>
} as const