import { Button, Label } from "./button.capsule.css";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion.capsule.css";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 32, background: "#f7fafc", minHeight: "100vh", display: "flex", flexDirection: "column", gap: 32 }}>

      <section>
        <Label primary />
      </section>

      <section>
        <h2 style={{ margin: "0 0 12px", fontSize: 12, textTransform: "uppercase", letterSpacing: ".05em", color: "#718096" }}>Button — intent</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button intent="primary" type="button" disabled>Primary</Button>
          <Button intent="secondary">Secondary</Button>
          <Button intent="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h2 style={{ margin: "0 0 12px", fontSize: 12, textTransform: "uppercase", letterSpacing: ".05em", color: "#718096" }}>Button — size</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button intent="primary" size="sm">Small</Button>
          <Button intent="primary" size="md">Medium</Button>
          <Button intent="primary" size="lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 style={{ margin: "0 0 12px", fontSize: 12, textTransform: "uppercase", letterSpacing: ".05em", color: "#718096" }}>Accordion</h2>
        <Accordion style={{ maxWidth: 480 }}>
          <AccordionItem>
            <AccordionTrigger state="open">Open item</AccordionTrigger>
            <AccordionContent data-state="open">Content of the open item.</AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger state="closed">Closed item</AccordionTrigger>
            <AccordionContent data-state="closed">This content is hidden.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  );
}
