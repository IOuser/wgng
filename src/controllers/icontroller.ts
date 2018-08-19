export interface IController<K> {
    isPressed(key: K): boolean;
}

export type TControllerState<K extends string> = { [key in K]?: boolean };
