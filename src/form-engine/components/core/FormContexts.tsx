import { createContext } from "react";
import type { useDataSources } from "../../hooks/useDataSources.js";
import type { FileUploadSource } from "../../types/index.js";

// Context to share data source state with child components
export const DataSourceContext = createContext<ReturnType<
  typeof useDataSources
> | null>(null);

// Context to share upload sources and data sources with child components
export const FormContext = createContext<{
  uploadSources?: FileUploadSource[];
  dataSourceState: ReturnType<typeof useDataSources>;
} | null>(null);
