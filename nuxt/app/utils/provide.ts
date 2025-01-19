export type ProjectErrors = {
   slug: string
   title: string
   description: string
}

export const PROVIDE_KEYS = {
   projectErrors: Symbol() as InjectionKey<ProjectErrors>
} as const