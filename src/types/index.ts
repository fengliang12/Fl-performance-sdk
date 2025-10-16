/**
 * 性能监控 SDK 配置接口
 */

export interface INavigationTiming {
  fetchTime?: number;
  workerTime?: number;
  totalTime?: number;
  downloadTime?: number;
  timeToFirstByte?: number;
  headerSize?: number;
  dnsLookupTime?: number;
  tcpTime?: number;
  whiteTime?: number;
  domTime?: number;
  loadTime?: number;
  parseDomTime?: number;
}

export type IPerformanceMonitorData =
  | number
  | INavigationTiming
  | INetworkInformation;

export interface INavigatorInfo {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  isLowEndDevice?: boolean;
  isLowEndExperience?: boolean;
  serviceWorkerStatus?: "controlled" | "supported" | "unsupported";
}

export type IVitalsScore = "good" | "needsImprovement" | "poor" | null;

/**
 * 自定义分析器选项接口
 */
export interface IAnalyticsTrackerOptions {
  metricName: string;
  data: IPerformanceMonitorData;
  eventProperties: object;
  navigatorInformation: INavigatorInfo;
  vitalsScore: IVitalsScore;
}

/**
 * 上报优先级枚举
 */
export enum AskPriority {
  URGENT = 1,
  IDLE = 2,
}

/**
 * 数据上报工具接口
 */
export interface IReportData {
  sendToAnalytics(level: AskPriority, body: string): void;
}

export interface IPerfObservers {
  [measureName: string]: any;
}

/**
 * 性能指标参数类型
 */
//性能指标参数
export type IPerformanceObserverType =
  | "first-input"
  | "largest-contentful-paint"
  | "layout-shift"
  | "longtask"
  | "measure"
  | "navigation"
  | "paint"
  | "element"
  | "resource"
  | "event";

export type IEventObserverType =
  | "FP"
  | "FCP"
  | "FID"
  | "LCP"
  | "CLS"
  | "TBT"
  | "INP";

export enum ObserveType {
  FP = "FP",
  FCP = "FCP",
  FID = "FID",
  LCP = "LCP",
  CLS = "CLS",
  TBT = "TBT",
  INP = "INP",
}

export type IPerformanceEntryInitiatorType =
  | "beacon"
  | "css"
  | "fetch"
  | "img"
  | "other"
  | "script"
  | "xmlhttprequest";

export interface IPerformanceEntry {
  name: string;
  entryType: IPerformanceObserverType;
  startTime: number;
  duration: number;
  renderTime: number;
  loadTime: number;
  decodedBodySize?: number;
  initiatorType: IPerformanceEntryInitiatorType;
  hadRecentInput: boolean;
  value?: number;
  identifier?: string;
  interactionId?: string;
}

export interface PerformanceEventTiming extends IPerformanceEntry {
  processingStart: DOMHighResTimeStamp;
  target?: Node;
}

/**
 * 资源时间消耗统计接口
 * 用于记录不同类型资源加载消耗的时间
 */
export interface IDataConsumption {
  beacon: number; // 信标请求消耗的时间
  css: number; // CSS 资源加载消耗的时间
  fetch: number; // Fetch API 请求消耗的时间
  img: number; // 图片资源加载消耗的时间
  other: number; // 其他类型资源消耗的时间
  script: number; // JavaScript 脚本加载消耗的时间
  total: number; // 所有资源消耗的总时间
  xmlhttprequest: number; // XMLHttpRequest 请求消耗的时间
}

export type EffectiveConnectionType =
  | "2g"
  | "3g"
  | "4g"
  | "5g"
  | "slow-2g"
  | "lte";
export interface INetworkInformation {
  downlink?: number;
  effectiveType?: EffectiveConnectionType;
  onchange?: () => void;
  rtt?: number;
  saveData?: boolean;
}

/**
 * 错误信息接口
 */
export interface IErrorInfo {
  scriptURI?: string; // 错误发生的脚本URL
  lineno?: number; // 行号
  colno?: number; // 列号
  error?: Error | any; // 错误对象
  message?: string; // 错误消息
  stack?: string; // 错误堆栈
  timestamp?: number; // 错误发生时间戳
  recording?: IRRWebRecording; // rrweb 录制数据
}

/**
 * RRWeb 录制数据接口
 */
export interface IRRWebRecording {
  events: any[]; // rrweb 事件数组
  startTime: number; // 录制开始时间
  endTime: number; // 录制结束时间
  duration: number; // 录制时长（毫秒）
  compressed?: boolean; // 是否已压缩
}

/**
 * RRWeb 配置接口
 */
export interface IRRWebConfig {
  enabled: boolean;
  maxDuration: number; // 最大录制时长（秒）
  maxEvents: number; // 最大事件数量
  sampling?: {
    scroll?: number;
    mousemove?: number;
    input?: number;
  };
}

export interface INavigatorInfo {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  isLowEndDevice?: boolean;
  isLowEndExperience?: boolean;
  serviceWorkerStatus?: "controlled" | "supported" | "unsupported";
}
