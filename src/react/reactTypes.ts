import { Accessor } from "solid-js";

export declare const UNDEFINED_VOID_ONLY: unique symbol;

export type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

export type DependencyList = ReadonlyArray<Accessor<unknown>>;
