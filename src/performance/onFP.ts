import logMetric from "../data/log";
import { IPerformanceEntry } from "../types";

/**
 * 首次绘制时间(FP,First Paint)是指浏览器首次将任何内容绘制到屏幕上的时间。
 * 它是衡量网页加载速度的一个重要指标，因为它表示用户可以看到页面的第一个元素。
 * @param list
 */
const onFP = (list: IPerformanceEntry[]) => {
  try {
    const fp = list.find((item) => item.name === "first-paint");
    if (fp) {
      console.log("FP:", fp.startTime);
      logMetric({
        duration: fp.startTime,
        measureName: "fp",
      });
    }
  } catch (error) {
    console.log("FPtime error:", error);
  }
};
export default onFP;
