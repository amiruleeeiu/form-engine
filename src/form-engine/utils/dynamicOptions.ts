/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { DynamicSelectConfig, SelectOption } from "../types/index.js";

/**
 * Hook to load dynamic select options (with cascading support)
 */
export function useDynamicOptions(config?: DynamicSelectConfig): {
  options: SelectOption[];
  loading: boolean;
  error: string | null;
} {
  const { watch } = useFormContext();
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Watch parent field if this is a cascading dropdown
  const parentValue = config?.dependsOn
    ? watch(config.dependsOnPath || config.dependsOn)
    : null;

  useEffect(() => {
    if (!config) return;

    // If this is a cascading dropdown and parent has no value, reset
    if (config.dependsOn && !parentValue) {
      setOptions([]);
      return;
    }

    const loadOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: any;

        // Use custom fetch function if provided
        if (config.fetchFunction) {
          data = await config.fetchFunction();
        }
        // Otherwise fetch from URL
        else if (config.url) {
          // Replace {parentValue} placeholder for cascading dropdowns
          const url = config.url.replace("{parentValue}", parentValue || "");
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
          data = await response.json();
        }

        // Transform data if transformer is provided
        const transformedOptions = config.transform
          ? config.transform(data)
          : data;
        setOptions(transformedOptions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load options");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [config, parentValue]);

  return { options, loading, error };
}
