/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { DataSource } from "../types/index.js";

interface DataSourceState {
  data: Record<string, any>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
}

export const useDataSources = (dataSources?: DataSource[]) => {
  const [state, setState] = useState<DataSourceState>({
    data: {},
    loading: {},
    errors: {},
  });

  useEffect(() => {
    if (!dataSources || dataSources.length === 0) return;

    const fetchData = async (ds: DataSource) => {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [ds.id]: true },
        errors: { ...prev.errors, [ds.id]: "" },
      }));

      try {
        const options: RequestInit = {
          method: ds.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...ds.headers,
          },
        };

        if (ds.method === "POST" && ds.params) {
          options.body = JSON.stringify(ds.params);
        }

        const url =
          ds.method === "GET" && ds.params
            ? `${ds.url}?${new URLSearchParams(ds.params).toString()}`
            : ds.url;

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let data = await response.json();

        // Transform if needed
        if (ds.transform) {
          data = ds.transform(data);
        }

        setState((prev) => ({
          ...prev,
          data: { ...prev.data, [ds.id]: data },
          loading: { ...prev.loading, [ds.id]: false },
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, [ds.id]: false },
          errors: { ...prev.errors, [ds.id]: (error as Error).message },
        }));
      }
    };

    // Fetch all data sources
    dataSources.forEach((ds) => {
      fetchData(ds);
    });
  }, [dataSources]);

  // Helper to get value from nested path (e.g., "user.name" -> data.user.name)
  const getValue = (dataSourceId?: string, path?: string): any => {
    if (!dataSourceId || !path) return undefined;

    const data = state.data[dataSourceId];
    if (!data) return undefined;

    return path.split(".").reduce((acc, part) => acc?.[part], data);
  };

  return {
    ...state,
    getValue,
  };
};
