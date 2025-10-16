import ReportData from "../data/ReportData";
import { IAnalyticsTrackerOptions } from "../types";
interface IConfig {
    reportData: ReportData;
    isResourceTiming: boolean;
    isElementTiming: boolean;
    maxTime: number;
    analyticsTracker?: (options: IAnalyticsTrackerOptions) => void;
}
export declare const config: IConfig;
export {};
//# sourceMappingURL=index.d.ts.map