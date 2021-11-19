import produce from "immer";
import { Paths } from "./types";
import _ from "lodash";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ElementType,
} from "react";

export function createStateHandler<T = {}>() {
  type ContextState = {
    state: T;
    onChange: (path: Paths<T>, newState: any) => void;
  };
  const Context = createContext<ContextState | undefined>(undefined);

  function withStateHandler<P extends { value: any; onChange: any } = any>(
    Component: ElementType<P>
  ) {
    // TODO add other hocs utils like debug name and ref forwarding
    function NewComponent({
      statePath,
      ...props
    }: Omit<P, "value" | "onChange"> & { statePath: Paths<T> }) {
      const context = useContext(Context);
      if (!context) {
        throw new Error("No previous context");
      }
      const { state, onChange } = context;
      return (
        // @ts-ignore
        <Component
          {...props}
          value={
            _.get(
              state as any,
              // @ts-ignore
              statePath as any
            ) as any
          }
          onChange={(ev: any) => {
            if (ev?.target) {
              // @ts-ignore
              onChange(statePath, ev.target?.value);
            } else {
              onChange(statePath, ev);
            }
          }}
        />
      );
    }
    return NewComponent;
  }

  function useStateHandler(initialValue: T) {
    const [state, setState] = useState(initialValue);

    const setValue = useCallback((path, value) => {
      return setState(
        produce((draft: any) => {
          _.set(draft, path, value);
        })
      );
    }, []);

    return [state, setValue] as const;
  }

  return [Context, useStateHandler, withStateHandler] as const;
}
