import { useRef, useState } from "react"
import {
  Button,
  Checkbox,
  Radio,
  Select,
  Switch,
  Input,
  TextareaInput,
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormFieldset,
  FormLegend,
  FormActions,
  FormSubmit,
} from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"
export function FormDemo() {
  const [serverInvalid, setServerInvalid] = useState(false)
  const [result, setResult] = useState("No changes submitted.")
  return (
    <>
      <section className="form-demo-group" aria-label="Contact form example">
        <h2>Contact preferences</h2>
        <Form
          onClearServerErrors={() => setServerInvalid(false)}
          onReset={() => setResult("No changes submitted.")}
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            const email = data.get("email")
            if (email === "taken@example.test") {
              setServerInvalid(true)
              return
            }
            const delivery =
              data.get("delivery") === "daily" ? "daily" : "immediate"
            setResult(
              `Saved locally: ${typeof email === "string" ? email : ""} · ${delivery} · notifications ${data.has("notifications") ? "on" : "off"} · product updates ${data.has("updates") ? "on" : "off"}`,
            )
          }}
        >
          <FormFieldset>
            <FormLegend>Contact preferences</FormLegend>
            <FormField name="email" serverInvalid={serverInvalid}>
              <FormLabel>Email address</FormLabel>
              <FormControl asChild>
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.test"
                  onChange={() => setServerInvalid(false)}
                />
              </FormControl>
              <FormDescription>
                Demo only. Try taken@example.test to see a simulated error.
              </FormDescription>
              <FormMessage match="valueMissing">
                Enter your email address.
              </FormMessage>
              <FormMessage match="typeMismatch">
                Enter a valid email address.
              </FormMessage>
              {serverInvalid && (
                <FormMessage>This email is already in use.</FormMessage>
              )}
            </FormField>
            <FormField name="bio">
              <FormLabel>About you</FormLabel>
              <FormControl asChild>
                <TextareaInput
                  maxLength={160}
                  placeholder="A few words about yourself."
                />
              </FormControl>
              <FormDescription>Optional. Up to 160 characters.</FormDescription>
            </FormField>
          </FormFieldset>
          <FormFieldset>
            <FormLegend>Delivery preferences</FormLegend>
            <Switch
              label="Email notifications"
              name="notifications"
              defaultChecked
            />
            <fieldset className="form-demo-choices">
              <legend className="demo-label">Delivery schedule</legend>
              <Radio
                label="Immediately"
                name="delivery"
                value="immediate"
                defaultChecked
              />
              <Radio label="Daily summary" name="delivery" value="daily" />
            </fieldset>
            <Checkbox label="Include product updates" name="updates" />
          </FormFieldset>
          <FormFieldset disabled>
            <FormLegend>Unavailable settings</FormLegend>
            <FormField name="organization">
              <FormLabel>Organization</FormLabel>
              <FormControl defaultValue="Personal workspace" />
            </FormField>
          </FormFieldset>
          <FormActions>
            <FormSubmit>Save preferences</FormSubmit>
            <Button appearance="secondary" type="reset">
              Reset
            </Button>
          </FormActions>
        </Form>
        <DemoResult>{result}</DemoResult>
      </section>
      <SupportRequestDemo />
    </>
  )
}

function SupportRequestDemo() {
  const topicControl = useRef<HTMLButtonElement>(null)
  const [topic, setTopic] = useState("")
  const [topicError, setTopicError] = useState("")
  const [failed, setFailed] = useState(false)
  const [result, setResult] = useState("No sample request submitted.")
  return (
    <section className="form-demo-group" aria-label="Support form example">
      <h2>Support request</h2>
      <p className="demo-label">Local example. Nothing is sent to support.</p>
      <Form
        aria-label="Sample support request"
        onReset={() => {
          setTopic("")
          setTopicError("")
          setFailed(false)
          setResult("No sample request submitted.")
        }}
        onSubmit={(event) => {
          event.preventDefault()
          if (!topic) {
            setTopicError("Choose a request topic.")
            topicControl.current?.focus()
            return
          }
          const data = new FormData(event.currentTarget)
          if (data.has("simulateFailure")) {
            setFailed(true)
            setResult("No sample request submitted.")
            return
          }
          setFailed(false)
          const subject = data.get("subject")
          setResult(
            `Saved locally: ${typeof subject === "string" ? subject : ""} · ${topic} · follow-up ${data.has("followUp") ? "on" : "off"}`,
          )
        }}
      >
        <FormFieldset>
          <FormLegend>Request details</FormLegend>
          <Select
            ref={topicControl}
            label="Request topic"
            placeholder="Choose a topic"
            name="topic"
            value={topic}
            onValueChange={(value) => {
              setTopic(value)
              setTopicError("")
            }}
            {...(topicError ? { error: topicError } : {})}
            options={[
              { value: "connection", label: "Connection & setup" },
              { value: "account", label: "Account access" },
              { value: "general", label: "General question" },
            ]}
          />
          <FormField name="subject">
            <FormLabel>Subject</FormLabel>
            <FormControl asChild>
              <Input required placeholder="What do you need help with?" />
            </FormControl>
            <FormMessage match="valueMissing">Enter a subject.</FormMessage>
          </FormField>
          <FormField name="details">
            <FormLabel>Request details</FormLabel>
            <FormControl asChild>
              <TextareaInput
                required
                placeholder="Describe the issue using sample information."
              />
            </FormControl>
            <FormDescription>
              Do not include passwords, codes or configuration credentials.
            </FormDescription>
            <FormMessage match="valueMissing">Describe the issue.</FormMessage>
          </FormField>
          <Checkbox
            label="Email me about this sample request"
            name="followUp"
            defaultChecked
          />
        </FormFieldset>
        <Checkbox label="Simulate submission failure" name="simulateFailure" />
        {failed && (
          <p className="form-demo-error" role="alert">
            Demo submission failed. Your draft is preserved; turn off the
            simulation and retry.
          </p>
        )}
        <FormActions>
          <FormSubmit>Submit sample request</FormSubmit>
          <Button appearance="secondary" type="reset">
            Reset request
          </Button>
        </FormActions>
      </Form>
      <DemoResult>{result}</DemoResult>
    </section>
  )
}
