import type { SettingRowProps } from "./setting-row.types"
export type { SettingRowProps } from "./setting-row.types"
import { settingRowStyles } from "./setting-row.styles"

export function SettingRow({
  label,
  value,
  action,
  className = "",
  ...props
}: SettingRowProps) {
  return (
    <div
      css={settingRowStyles}
      {...props}
      className={`yu-setting-row ${className}`}
    >
      <div className="yu-setting-row-content">
        <p>{label}</p>
        <div>{value}</div>
      </div>
      {action}
    </div>
  )
}
