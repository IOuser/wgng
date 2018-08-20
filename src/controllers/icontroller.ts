import { ISubscription } from 'utils/isubscription';

export interface IController<K> extends ISubscription {
    isPressed(key: K): boolean;
}

export type TControllerState<K extends string> = { [key in K]?: boolean };
