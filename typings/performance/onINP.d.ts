import { IPerformanceEntry } from "../types";
declare const onINP: (list: IPerformanceEntry[]) => void;
/**
 * 获取当前 INP 值
 * 用于在页面卸载或其他需要最终 INP 值的场景中获取数据
 *
 * @returns 当前的 INP 值和相关统计信息
 */
export declare const getINPValue: () => {
    value: number;
    maxDelay: number;
    totalInteractions: number;
    allDelays: number[];
};
export default onINP;
//# sourceMappingURL=onINP.d.ts.map