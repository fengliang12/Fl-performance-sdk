import logMetric from "../data/log";
import { IPerformanceEntry } from "../types";

/**
 * 处理元素时间性能条目
 * 遍历所有元素时间性能条目，记录特定元素的性能指标
 *
 * @param list - 元素时间性能条目数组，包含了页面上所有设置了 elementtiming 属性的元素的性能数据
 */
const onElementTiming = (list: IPerformanceEntry[]) => {
  // 遍历所有元素时间性能条目
  list.forEach((entry) => {
    if (entry.identifier) {
      // 记录特定元素的性能指标
      // identifier 是在 HTML 元素上设置的 elementtiming 属性值
      // 用于标识和区分不同的监控元素
      logMetric({
        duration: entry.startTime,
        measureName: entry.identifier,
      });
    }
  });
};

export default onElementTiming;
