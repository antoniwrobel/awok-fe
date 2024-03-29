import { Box } from "@mui/material";
import { ReactNode } from "react";
import { userFeaturesArray } from "src/pages/InventoryPage/components/UpperContainer";

type FeatureContainerPropsType<P> = P & { children?: ReactNode | null };

export const FeatureContainer = (
  featureContainerProps: FeatureContainerPropsType<{
    featureId: number;
    isLastElement?: boolean;
  }>
) => {
  const { children, featureId, isLastElement } = featureContainerProps;

  const sx = {
    pb: "20px",
    mb: !isLastElement ? "20px" : "0",
    borderBottom: "1px solid",
  };

  if (!userFeaturesArray.includes(featureId)) {
    return null;
  }

  return <Box sx={sx}>{children}</Box>;
};
