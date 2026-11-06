import { useState } from "react"
import { Button, InputOTP } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function OTPDemo() {
  const [value, setValue] = useState("")
  const [result, setResult] = useState<"success" | "error" | null>(null)
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setResult(value === "123456" ? "success" : "error")
        }}
      >
        <InputOTP
          label="Verification code"
          hint="Enter a six-digit code. Demo code: 123456."
          {...(result === "error"
            ? { error: "Incorrect code. Try 123456." }
            : {})}
          value={value}
          onValueChange={(next) => {
            setValue(next)
            setResult(null)
          }}
        />
        <Button type="submit" disabled={value.length !== 6}>
          Verify code
        </Button>
      </form>
      <DemoResult>
        {result === "success"
          ? "Code verified in this demo."
          : value.length + " / 6"}
      </DemoResult>
    </>
  )
}
