import config from "../../yupress.config"
if (!config.site) throw new Error("Docs site configuration is required")
export const site = config.site
