import { config } from "../config";
import logMetric from "../data/log";
import { cls, lcp, tbt } from "../data/metrics";
import { ObserveType } from "../types";
import { perfObservers } from "./observeInstances";
import onElementTiming from "./onElementTiming";
import onFCP from "./onFCP";
import onFID from "./onFID";
import onFP from "./onFP";
import onINP, { getINPValue } from "./onINP";
import onLCP from "./onLCP";
import onResourceTiming from "./onResourceTiming";
import onTTFB from "./onTTFB";
import {
  createPerformanceObserver,
  disconnectPerformanceObserver,
} from "./performanceObserver";
import onCLS from "./onCLS";

export const initPerformanceObserver = () => {
  // 先进行计算 TTFB（首字节时间）
  onTTFB();

  // 计算FP（首次绘制时间）
  perfObservers[ObserveType.FP] = createPerformanceObserver("paint", onFP);

  // 计算 FCP（首次内容绘制时间）
  perfObservers[ObserveType.FCP] = createPerformanceObserver("paint", onFCP);

  // 监控首次输入延迟（FID）
  perfObservers[ObserveType.FID] = createPerformanceObserver(
    "first-input",
    onFID
  );

  // 监控最大内容绘制（LCP）
  perfObservers[ObserveType.LCP] = createPerformanceObserver(
    "largest-contentful-paint",
    onLCP
  );

  // 监控布局偏移（CLS）
  perfObservers[ObserveType.CLS] = createPerformanceObserver(
    "layout-shift",
    onCLS
  );

  // 监控交互响应性（INP）
  perfObservers[ObserveType.INP] = createPerformanceObserver("event", onINP);

  // 监控资源加载性能（可选）
  if (config.isResourceTiming) {
    createPerformanceObserver("resource", onResourceTiming);
  }

  // 监控元素时间指标（可选）
  if (config.isElementTiming) {
    createPerformanceObserver("element", onElementTiming);
  }
};

/**
 * 页面隐藏时断开性能观察器连接
 * 记录最终值并清理资源
 */
export const disconnectPerfObserversHidden = (): void => {
  // 记录最终 LCP 值并断开连接
  if (perfObservers[ObserveType.LCP]) {
    logMetric({
      duration: lcp.value,
      measureName: `lcpFinal`,
    });
    disconnectPerformanceObserver(ObserveType.LCP);
  }

  // 记录最终 CLS 值并断开连接
  if (perfObservers[ObserveType.CLS]) {
    if (typeof perfObservers[ObserveType.CLS].takeRecords === "function") {
      perfObservers[ObserveType.CLS].takeRecords();
    }
    logMetric({
      duration: cls.value,
      measureName: `clsFinal`,
    });
    disconnectPerformanceObserver(ObserveType.CLS);
  }

  // 记录最终 TBT 值并断开连接
  if (perfObservers[ObserveType.TBT]) {
    logMetric({
      duration: tbt.value,
      measureName: `tbtFinal`,
    });
    disconnectPerformanceObserver(ObserveType.TBT);
  }

  // 记录最终 INP 值并断开连接
  if (perfObservers[ObserveType.INP]) {
    const finalINP = getINPValue();
    if (finalINP.value > 0) {
      logMetric({
        duration: finalINP.value,
        measureName: `inpFinal`,
        customProperties: finalINP,
      });
    }
    disconnectPerformanceObserver(ObserveType.INP);
  }
};
