import { config } from "./config";
import ReportData from "./data/ReportData";
import analyticsTracker from "./data/analyticsTracker";
import { D, W, WN } from "./data/constants";
import { logMetricObject } from "./data/log";
import { reportStorageEstimate } from "./data/storageEstimate";
import ErrorMonitor from "./error";
import { getNetworkInformation } from "./helpers/getNetworkInformation";
import { didVisibilityChange } from "./helpers/onVisibilityChange";
import getNavigationTiming from "./performance/getNavigationTiming";
import {
  disconnectPerfObserversHidden,
  initPerformanceObserver,
} from "./performance/observe";
import { isPerformanceSupported } from "./tools";
import { IAnalyticsTrackerOptions, IRRWebConfig } from "./types";

interface IOptions {
  // 捕获错误
  captureError?: boolean;
  // 资源指标
  resourceTiming?: boolean;
  // 元素指标
  elementTiming?: boolean;
  // 自定义分析器
  analyticsTracker?: (options: IAnalyticsTrackerOptions) => void;
  // 最大测量时间
  maxMeasureTime?: number;
  // 日志 URL
  logUrl?: string;
  // RRWeb 配置
  rrwebConfig?: Partial<IRRWebConfig>;
}

export default class PerformanceMonitorSdk {
  /** SDK版本号 */
  private v = "1.0.0";

  /**数据上报接口实例，供外部调用数据上报功能 */
  public reportData: ReportData;

  public options: IOptions;

  /** 错误监控实例 */
  private errorMonitor?: ErrorMonitor;

  constructor(options: IOptions = {}) {
    // 验证必需参数：日志上报URL
    const logUrl = options.logUrl;
    if (!logUrl) {
      throw new Error(`系统监控平台${this.v}提示未传递logUrl`);
    }
    this.options = options;

    //初始化数据上报实例，用于向后台输送监控数据
    this.reportData = new ReportData({ logUrl });
    config.reportData = this.reportData;

    // 配置数据分析追踪器
    const _analyticsTracker = options.analyticsTracker;
    if (_analyticsTracker) {
      config.analyticsTracker = _analyticsTracker;
    } else {
      // 这里是不是可以接入mcp
      config.analyticsTracker = analyticsTracker;
    }

    // 配置性能监控选项
    config.isResourceTiming = !!options.resourceTiming; // 是否开启资源加载时间监控
    config.isElementTiming = !!options.elementTiming; // 是否开启元素时间监控
    config.maxTime = options.maxMeasureTime || config.maxTime; // 设置最大测量时间，防止异常数据

    /**
     * 错误监控的配置
     */
    if (options.captureError) {
      this.errorMonitor = new ErrorMonitor(options.rrwebConfig);
      this.errorMonitor.init();
    }

    //浏览器兼容性检查：如果不支持性能指标则退出
    // 这确保了SDK只在支持的浏览器中运行，避免运行时错误
    if (!isPerformanceSupported()) return;

    // 性能观察器初始化：如果浏览器支持PerformanceObserver则启用
    // PerformanceObserver是监控性能指标的核心API
    if ("PerformanceObserver" in W) {
      initPerformanceObserver();
    }

    // 页面可见性变化监听初始化
    // 当页面不可见时，停止性能监控以节省资源
    if (typeof D.hidden !== "undefined") {
      // Opera 12.10 和 Firefox 18 及更高版本支持
      D.addEventListener(
        "visibilitychange",
        didVisibilityChange.bind(this, disconnectPerfObserversHidden)
      );
    }

    // 记录页面导航时间数据（DNS请求、白屏时间等）
    // 这些数据反映了页面的基础加载性能
    logMetricObject({
      measureName: "navigationTiming",
      metric: getNavigationTiming(),
    });

    // 记录用户网络信息（H5+多普勒测速）
    // 包括网络类型、下行带宽、RTT等信息
    logMetricObject({
      measureName: "networkInformation",
      metric: getNetworkInformation(),
    });

    // 管理离线缓存数据：如果浏览器支持存储估算API则启用
    // 监控应用的存储使用情况，帮助优化离线体验
    if (WN && WN.storage && typeof WN.storage.estimate === "function") {
      WN.storage.estimate().then(reportStorageEstimate);
    }
  }

  /**
   * 销毁 SDK 实例，清理资源
   */
  public destroy(): void {
    // 销毁错误监控器
    if (this.errorMonitor) {
      this.errorMonitor.destroy();
      this.errorMonitor = undefined;
    }
  }
}
