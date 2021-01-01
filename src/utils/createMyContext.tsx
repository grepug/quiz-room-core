import { createContext ,useContext} from "react";  

export const createMyContext = <Props extends {}, HookReturnType>(
  hook: (props: Props) => HookReturnType,
) => {
  const Context = createContext<HookReturnType | null>(null);

  const Provider = ({
    children,
    ...props
  }: Props & { children?: React.ReactNode }) => {
    // @ts-ignore
    const value = hook(props);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { Provider, Context, useContext: () => useContext(Context) };
};
