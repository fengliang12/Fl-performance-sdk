import { lcp } from "../data/metrics";
import { IPerformanceEntry } from "../types";

const onLCP = (list: IPerformanceEntry[]) => {
  // 获取最后一个 LCP 条目
  // 因为 LCP 可能在页面加载过程中多次更新，我们取最新的值
  const lastEntry = list.pop();

  if (lastEntry) {
    // 使用 renderTime 或 loadTime 作为 LCP 值
    // renderTime: 元素渲染完成的时间、loadTime: 元素加载完成的时间
    lcp.value = lastEntry.renderTime || lastEntry.loadTime;
  }
};
export default onLCP;
