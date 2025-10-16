import { IPerformanceEntry } from "../types";
/**
 * 初始化资源时间监控
 *
 * 该函数用于监控和分析页面中各种资源的加载性能，包括：
 * 1. 记录资源加载的详细时间信息（如果启用）
 * 2. 统计不同类型资源的体积大小
 * 3. 累积计算总资源消耗
 *
 * 支持的资源类型包括：script、css、img、fetch、xmlhttprequest 等
 *
 * @param performanceEntries - 性能条目数组，包含各种资源加载的详细信息
 */
declare const onResourceTiming: (performanceEntries: IPerformanceEntry[]) => void;
export default onResourceTiming;
//# sourceMappingURL=onResourceTiming.d.ts.map