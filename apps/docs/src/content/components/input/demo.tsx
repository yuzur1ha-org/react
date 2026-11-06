import {
  Input,
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  TextField,
} from "@yuzur1ha/ui"
export function InputDemo() {
  return (
    <>
      <TextField
        label="Standalone field"
        hint="TextField owns its label and help text."
        placeholder="A complete field"
      />
      <div className="demo-row">
        {(["small", "medium", "large"] as const).map((size) => (
          <TextField
            key={size}
            size={size}
            label={`${size} field`}
            placeholder="Enter a value"
          />
        ))}
      </div>
      <Form>
        <FormField name="composed">
          <FormLabel>Composed field</FormLabel>
          <FormControl asChild>
            <Input placeholder="A bare input inside FormField" />
          </FormControl>
          <FormDescription>
            FormField owns the label, description and validation.
          </FormDescription>
        </FormField>
      </Form>
    </>
  )
}
