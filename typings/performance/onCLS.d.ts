import { IPerformanceEntry } from "../types";
/**
 * 检测新的布局偏移事件并更新累积布局偏移分数
 *
 * 该函数用于监控页面的视觉稳定性，通过累积计算布局偏移分数来评估用户体验。
 * CLS (Cumulative Layout Shift) 是 Core Web Vitals 的重要指标之一。
 *
 * 布局偏移检测规则：
 * 1. 只计算没有最近用户输入的布局偏移
 * 2. 累积所有有效的布局偏移值
 * 3. 确保布局偏移值的有效性
 *
 * @param performanceEntries - 性能条目数组，包含布局偏移事件的详细信息
 */
declare const onCLS: (list: IPerformanceEntry[]) => void;
export default onCLS;
//# sourceMappingURL=onCLS.d.ts.map