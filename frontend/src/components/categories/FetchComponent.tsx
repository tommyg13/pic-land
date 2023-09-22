import React, { ReactNode } from "react";

type FetchComponentProps = {
  loading: boolean;
  children: ReactNode;
};

const FetchComponent: React.FC<FetchComponentProps> = ({
  loading,
  children,
}) => {
  return <div>{loading ? "loading" : children}</div>;
};

export default FetchComponent;
