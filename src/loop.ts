import { IDestroyable } from 'utils/idestroyable';

export type TLoopCallback = (t: number) => void;

export interface ILoop extends IDestroyable {
    start(): void;
    stop(): void;
}

export class Loop implements ILoop {
    private _rafID: number = -1;
    private _callback: TLoopCallback;
    private _t0: number = performance.now();

    public constructor(callback: TLoopCallback) {
        this._callback = callback;
    }

    public start(): void {
        console.log('start');
        this._t0 = performance.now();
        this._scheduleFrame();
    }

    public stop(): void {
        this._t0 = -1;
        window.cancelAnimationFrame(this._rafID);
    }

    public destroy(): void {
        console.info('Loop: Destroy');
        this.stop();
    }

    private _scheduleFrame(): void {
        this._rafID = window.requestAnimationFrame(this._tick);
    }

    private _tick = () => {
        if (this._t0 === -1) {
            return;
        }

        const t1 = performance.now();
        const dt = t1 - this._t0;
        this._t0 = t1;
        this._callback(dt);
        this._scheduleFrame();
    };
}
