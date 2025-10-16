import ReportData from "./data/ReportData";
import { IAnalyticsTrackerOptions, IRRWebConfig } from "./types";
interface IOptions {
    captureError?: boolean;
    resourceTiming?: boolean;
    elementTiming?: boolean;
    analyticsTracker?: (options: IAnalyticsTrackerOptions) => void;
    maxMeasureTime?: number;
    logUrl?: string;
    rrwebConfig?: Partial<IRRWebConfig>;
}
export default class PerformanceMonitorSdk {
    /** SDK版本号 */
    private v;
    /**数据上报接口实例，供外部调用数据上报功能 */
    reportData: ReportData;
    options: IOptions;
    /** 错误监控实例 */
    private errorMonitor?;
    constructor(options?: IOptions);
    /**
     * 销毁 SDK 实例，清理资源
     */
    destroy(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map