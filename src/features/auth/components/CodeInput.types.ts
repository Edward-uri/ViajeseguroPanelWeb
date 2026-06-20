export interface CodeInputProps {
  code: string[]
  onChange: (index: number, value: string) => void
  disabled?: boolean
}
