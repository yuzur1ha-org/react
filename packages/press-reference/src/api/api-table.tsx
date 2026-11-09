import { useReferenceMessages } from "../messages"
import { ScrollArea } from "@yuzur1ha/ui"
import { styles } from "./api-table.styles"
import type { ComponentApi } from "./api.types"

export function ApiTable({ schema }: { schema: ComponentApi }) {
  const text = useReferenceMessages()
  return (
    <div className="component-api" css={styles}>
      {schema.parts.map((part) => (
        <section
          key={part.name}
          className="component-api-part"
          aria-label={`${part.name} API`}
        >
          <h3>{part.name}</h3>
          <p>{part.description}</p>
          {part.props.length > 0 ? (
            <ScrollArea
              appearance="normal"
              label={`${part.name} ${text.properties}`}
              orientation="horizontal"
              className="api-table-scroll"
            >
              <table className="api-table">
                <caption>{part.typeName}</caption>
                <thead>
                  <tr>
                    <th scope="col">{text.property}</th>
                    <th scope="col">{text.type}</th>
                    <th scope="col">{text.required}</th>
                    <th scope="col">{text.default}</th>
                    <th scope="col">{text.description}</th>
                  </tr>
                </thead>
                <tbody>
                  {part.props.map((property) => (
                    <tr key={property.name}>
                      <th scope="row">
                        <code>{property.name}</code>
                      </th>
                      <td>
                        <code>{property.type}</code>
                      </td>
                      <td>{property.required ? text.yes : text.no}</td>
                      <td>
                        <code>{property.default ?? "—"}</code>
                      </td>
                      <td>{property.description || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          ) : (
            <p>{text.inheritedProperties}</p>
          )}
          {part.methods.length > 0 ? (
            <ScrollArea
              appearance="normal"
              label={`${part.name} ${text.methods}`}
              orientation="horizontal"
              className="api-table-scroll"
            >
              <table className="api-table">
                <caption>
                  {part.name} {text.methods}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{text.method}</th>
                    <th scope="col">{text.signature}</th>
                    <th scope="col">{text.description}</th>
                  </tr>
                </thead>
                <tbody>
                  {part.methods.map((method) => (
                    <tr key={method.name}>
                      <th scope="row">
                        <code>{method.name}</code>
                      </th>
                      <td>
                        <code>{method.signature}</code>
                      </td>
                      <td>{method.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          ) : (
            <p className="api-method-note">{text.noMethods}</p>
          )}
        </section>
      ))}
    </div>
  )
}
