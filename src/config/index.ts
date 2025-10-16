import ReportData from "../data/ReportData";
import { IAnalyticsTrackerOptions } from "../types";

interface IConfig {
  // 上报数据
  reportData: ReportData;
  // 是否开启资源指标
  isResourceTiming: boolean;
  // 是否开启元素指标
  isElementTiming: boolean;
  // 最大测量时间
  maxTime: number;
  // 自定义分析器
  analyticsTracker?: (options: IAnalyticsTrackerOptions) => void;
}

export const config: IConfig = {
  reportData: new ReportData({ logUrl: "hole" }),
  isResourceTiming: true,
  isElementTiming: true,
  maxTime: 5000,
};
