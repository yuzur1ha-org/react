import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@yuzur1ha/ui"
export function AccordionDemo() {
  return (
    <>
      <Accordion type="single" collapsible defaultValue="overview">
        <AccordionItem value="overview">
          <AccordionTrigger>Overview</AccordionTrigger>
          <AccordionContent>
            One section at a time. Open another section or collapse this one.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            The triggers support arrow keys, Home, End, Enter and Space.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="future" disabled>
          <AccordionTrigger>Unavailable section</AccordionTrigger>
          <AccordionContent>This section is disabled.</AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="demo-label">Multiple sections</p>
      <Accordion type="multiple" defaultValue={["appearance"]}>
        <AccordionItem value="appearance">
          <AccordionTrigger>Appearance</AccordionTrigger>
          <AccordionContent>
            Square edges, shared tokens and quiet motion.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="interaction">
          <AccordionTrigger>Interaction</AccordionTrigger>
          <AccordionContent>
            Open sections stay open until you close them.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
