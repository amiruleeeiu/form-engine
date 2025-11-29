import { useEffect, useState } from "react";
import type { DynamicSelectConfig, SelectOption } from "../types/index.js";

/**
 * Hook to load dynamic select options
 */
export function useDynamicOptions(config?: DynamicSelectConfig): {
  options: SelectOption[];
  loading: boolean;
  error: string | null;
} {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config) return;

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
          const response = await fetch(config.url);
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
  }, [config]);

  return { options, loading, error };
}
