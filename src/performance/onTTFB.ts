import { WP } from "../data/constants";
import logMetric from "../data/log";
import { isPerformanceSupported } from "../tools";

/**
 * 首次字节时间(TTFB,Time to First Byte)是衡量服务器响应速度的一个重要性能指标，
 * 指的是从浏览器开始请求到接收到第一个字节的时间。TTFB对于服务器性能和网络响应时间都非常敏感。
 * @returns
 */
const onTTFB = (): void => {
  // 检查浏览器是否支持性能监控 API
  if (!isPerformanceSupported()) {
    return;
  }

  try {
    // 获取导航类型的性能条目
    const navigationEntry = WP.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    // Safari 11.2 版本之前不支持 Navigation Timing API
    if (!navigationEntry) {
      return;
    }

    // 首字节时间 (TTFB) responseStart 响应开始时间 - requestStart 请求开始时间
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

    if (ttfb > 0) {
      // 记录 TTFB 指标
      logMetric({
        duration: ttfb,
        measureName: "ttfb",
      });
    }
  } catch (error) {}
};
export default onTTFB;
