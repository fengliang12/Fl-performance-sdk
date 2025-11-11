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
export type IPerformanceMonitorData = number | INavigationTiming | INetworkInformation;
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
export declare enum AskPriority {
    URGENT = 1,
    IDLE = 2
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
export type IPerformanceObserverType = "first-input" | "largest-contentful-paint" | "layout-shift" | "longtask" | "measure" | "navigation" | "paint" | "element" | "resource" | "event";
export type IEventObserverType = "FP" | "FCP" | "FID" | "LCP" | "CLS" | "TBT" | "INP";
export declare enum ObserveType {
    FP = "FP",
    FCP = "FCP",
    FID = "FID",
    LCP = "LCP",
    CLS = "CLS",
    TBT = "TBT",
    INP = "INP"
}
export type IPerformanceEntryInitiatorType = "beacon" | "css" | "fetch" | "img" | "other" | "script" | "xmlhttprequest";
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
    beacon: number;
    css: number;
    fetch: number;
    img: number;
    other: number;
    script: number;
    total: number;
    xmlhttprequest: number;
}
export type EffectiveConnectionType = "2g" | "3g" | "4g" | "5g" | "slow-2g" | "lte";
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
    scriptURI?: string;
    lineno?: number;
    colno?: number;
    error?: Error | any;
    message?: string;
    stack?: string;
    timestamp?: number;
    recording?: IRRWebRecording;
}
/**
 * RRWeb 录制数据接口
 */
export interface IRRWebRecording {
    events: any[];
    startTime: number;
    endTime: number;
    duration: number;
    compressed?: boolean;
}
/**
 * RRWeb 配置接口
 */
export interface IRRWebConfig {
    enabled: boolean;
    maxDuration: number;
    maxEvents: number;
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
/**
 * 兼容导出的错误信息类型别名
 * 与 core 模块中使用的 ErrorInfo 命名保持一致
 */
export type ErrorInfo = IErrorInfo;
/** 性能监控核心配置 */
export interface PerformanceConfig {
    appId?: string;
    apiEndpoint?: string;
    autoCollect?: boolean;
    sampleRate?: number;
    debug?: boolean;
}
/** 指标类型 */
export type MetricType = "gauge" | "counter" | "timing";
/**
 * 性能指标结构定义
 */
export interface PerformanceMetric {
    name: string;
    value: number;
    timestamp: number;
    type: MetricType;
    tags?: Record<string, string>;
}
/**
 * 导航时序结构定义
 */
export interface NavigationTiming {
    dnsLookup: number;
    tcpConnect: number;
    request: number;
    response: number;
    domParse: number;
    resourceLoad: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
}
/**
 * 资源加载时序结构定义
 */
export interface ResourceTiming {
    name: string;
    type: string;
    startTime: number;
    duration: number;
    transferSize: number;
}
/** 用户行为类型 */
export type UserActionType = "click" | "scroll";
/**
 * 用户行为结构定义
 */
export interface UserAction {
    type: UserActionType;
    target?: string;
    timestamp: number;
    data?: Record<string, any>;
}
//# sourceMappingURL=index.d.ts.map