import { IEventObserverType, IPerformanceObserverType } from "../types";
export declare const createPerformanceObserver: (eventType: IPerformanceObserverType, cb: (performanceEntries: any[]) => void) => PerformanceObserver | null;
/**
 * 断开指定类型的性能观察者
 * @param type 性能观察者类型
 */
export declare const disconnectPerformanceObserver: (type: IEventObserverType) => void;
//# sourceMappingURL=performanceObserver.d.ts.map