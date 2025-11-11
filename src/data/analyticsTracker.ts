import { config } from "../config";
import { AskPriority, IAnalyticsTrackerOptions } from "../types";

/**
 * 默认数据分析追踪器
 * 将性能指标整理后交由 ReportData 统一上报
 */
const analyticsTracker = (options: IAnalyticsTrackerOptions): void => {
  const {
    metricName,
    eventProperties,
    data,
    navigatorInformation,
    vitalsScore,
  } = options;

  const payload = {
    metricName,
    data,
    vitalsScore,
    navigatorInformation,
    eventProperties,
    timestamp: Date.now(),
  };

  try {
    // Web Vitals 本身不是阻塞数据，默认以空闲优先级上报
    config.reportData.sendToAnalytics(
      AskPriority.IDLE,
      JSON.stringify(payload)
    );
  } catch (error) {
    // 避免因上报失败阻断主流程
    if (config?.reportData) {
      console.warn("[Performance SDK] analyticsTracker failed", error);
    }
  }
};

export default analyticsTracker;
