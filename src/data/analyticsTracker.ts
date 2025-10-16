import { IAnalyticsTrackerOptions } from "../types";
const analyticsTracker = (options: IAnalyticsTrackerOptions): void => {
  const {
    metricName,
    eventProperties,
    data,
    navigatorInformation,
    vitalsScore,
  } = options;
  console.log("默认数据分析", options);
};
export default analyticsTracker;
