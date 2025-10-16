import logMetric from "../data/log";
import { fcp } from "../data/metrics";
import { IPerformanceEntry, ObserveType } from "../types";
import { perfObservers } from "./observeInstances";
import onTBT from "./onTBT";
import { createPerformanceObserver } from "./performanceObserver";

/**
 * 首次内容绘制时间(FCP,First Contentful Paint)是指浏览器首次将任何内容绘制到屏幕上的时间。
 * 它是衡量网页加载速度的一个重要指标，因为它表示用户可以看到页面的第一个元素。
 * @param list
 */
const onFCP = (list: IPerformanceEntry[]) => {
  try {
    // 查找首次内容绘制时间（FCP）条目
    const tempFCP = list.find((item) => item.name === "first-contentful-paint");

    if (tempFCP) {
      console.log("FCP:", tempFCP.startTime);
      logMetric({
        duration: tempFCP.startTime,
        measureName: "fcp",
      });

      // FCP 触发后，启动长任务监控
      // TBT = 从FCP到TTI的总阻塞时间 ，这是衡量页面交互性能的重要指标
      fcp.value = tempFCP.startTime;
      perfObservers[ObserveType.TBT] = createPerformanceObserver(
        "longtask",
        onTBT
      );
    }
  } catch (error) {
    console.log("FCPtime error:", error);
  }
};
export default onFCP;
