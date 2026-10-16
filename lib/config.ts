// Single source for shipping / returns / contact facts (ASSUMPTION A3). Reads site.json.
import { site } from "./data/content";

export { site };

export const fullAddress = `${site.address.line1}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

export const SITE_URL = "https://www.blanklabels.com";

export const titleFor = (page: string) => `${page} | BlankLabels.com - Made in USA Labels`;
