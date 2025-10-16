import logMetric, { logMetricObject } from "../data/log";
import { cls, lcp, rt, tbt } from "../data/metrics";
import { ObserveType } from "../types";
import { perfObservers } from "./observeInstances";
import { disconnectPerformanceObserver } from "./performanceObserver";

const onFID = (list: PerformanceEventTiming[]) => {
  try {
    // 取最后一位即为我们希望所获取的时间点
    // 因为 FID 观察器可能触发多次，我们只需要最后一次的输入事件
    const lastEntry = list.pop();

    if (lastEntry) {
      // Core Web Vitals FID 逻辑
      // 测量输入事件的延迟操作：从是用户首次交互的时间戳 - 事件开始时间
      // 这是衡量页面响应性的关键指标
      logMetric({
        duration: lastEntry.processingStart - lastEntry.startTime,
        measureName: "fidVitals",
        customProperties: {
          performanceEntry: lastEntry,
        },
      });

      // 传统的 FID 逻辑
      // 测量处理第一个输入事件的持续时间
      // 包括事件处理的总时间
      logMetric({
        duration: lastEntry.duration,
        measureName: "fid",
        customProperties: {
          performanceEntry: lastEntry,
        },
      });

      // 销毁对 FID 的注册回调，避免过多的观察者造成内存泄露
      disconnectPerformanceObserver(ObserveType.FID);

      // 初始化并记录 LCP (Largest Contentful Paint) 指标
      logMetric({
        duration: lcp.value,
        measureName: "lcp",
      });

      // 如果存在 LCP 观察器，立即获取其记录
      // takeRecords() 方法可以立即获取所有待处理的性能条目
      if (
        perfObservers[ObserveType.LCP] &&
        typeof perfObservers[ObserveType.LCP].takeRecords === "function"
      ) {
        perfObservers[ObserveType.LCP].takeRecords();
      }

      // 记录 CLS (Cumulative Layout Shift) 累积布局偏移指标
      logMetric({
        duration: cls.value,
        measureName: "cls",
      });

      // 记录 TBT (Total Blocking Time) 总阻塞时间指标
      logMetric({
        duration: tbt.value,
        measureName: "tbt",
      });

      // FID 触发后 5 秒延迟记录 TBT 指标
      // 这可以反映用户在首次交互后的页面响应性
      setTimeout(() => {
        logMetric({
          duration: tbt.value,
          measureName: "tbt5S",
        });
      }, 5000);

      // FID 触发后 10 秒延迟记录 TBT 指标和资源消耗数据
      // 这可以反映用户在首次交互后一段时间内的整体体验
      setTimeout(() => {
        logMetric({
          duration: tbt.value,
          measureName: "tbt10S",
        });

        // FID 被激活以后 10S 的整体数据消耗
        // 记录各种资源类型的加载时间消耗
        logMetricObject({
          metric: rt.value,
          measureName: "dataConsumption",
        });
      }, 10000);
    }
  } catch (error) {
    console.log("FIDtime error:", error);
  }
};
export default onFID;
