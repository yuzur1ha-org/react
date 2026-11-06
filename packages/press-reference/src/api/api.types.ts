export type ApiProperty = {
  name: string
  type: string
  required: boolean
  description: string
  default?: string
}
export type ApiMethod = {
  name: string
  signature: string
  description: string
}
export type ComponentApi = {
  $schema?: string
  component: string
  parts: {
    name: string
    typeName: string
    description: string
    props: ApiProperty[]
    methods: ApiMethod[]
  }[]
}
