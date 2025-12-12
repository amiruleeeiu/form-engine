import { useContext } from "react";
import { FormContext } from "../components/core/FormEngine.js";

export const useUploadSources = () => {
  const context = useContext(FormContext);

  if (!context) {
    // Return empty functions if context not available
    return {
      getUploadSource: () => undefined,
    };
  }

  const { uploadSources } = context;

  const getUploadSource = (uploadSourceId: string) => {
    if (!uploadSources) return undefined;
    return uploadSources.find((source) => source.id === uploadSourceId);
  };

  return {
    getUploadSource,
  };
};
