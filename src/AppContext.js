import React from "react";

const NlsContext = React.createContext({});

export const NlsProvider = NlsContext.Provider;
export const NlsConsumer = NlsContext.Consumer;