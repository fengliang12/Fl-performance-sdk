import { IPerformanceEntry } from "../types";
/**
 * 总阻塞时间(TBT,Total Blocking Time)是一个重要的网页性能指标，用于量化页面加载过程中用户体验到的阻塞时间。
 * TBT衡量的是从页面开始加载到可以响应用户输入之间的时间，特别是那些由于长任务阻塞主线程而导致的延迟。
 * 实际上他是“从FCP -> TTI 的时间
 * @param list
 */
declare const onTBT: (list: IPerformanceEntry[]) => void;
export default onTBT;
//# sourceMappingURL=onTBT.d.ts.map