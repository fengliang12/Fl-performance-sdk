import { IPerformanceEntry } from "../types";
/**
 * 处理元素时间性能条目
 * 遍历所有元素时间性能条目，记录特定元素的性能指标
 *
 * @param list - 元素时间性能条目数组，包含了页面上所有设置了 elementtiming 属性的元素的性能数据
 */
declare const onElementTiming: (list: IPerformanceEntry[]) => void;
export default onElementTiming;
//# sourceMappingURL=onElementTiming.d.ts.map