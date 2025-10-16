import { fcp, tbt } from "../data/metrics";
import { IPerformanceEntry } from "../types";

/**
 * 总阻塞时间(TBT,Total Blocking Time)是一个重要的网页性能指标，用于量化页面加载过程中用户体验到的阻塞时间。
 * TBT衡量的是从页面开始加载到可以响应用户输入之间的时间，特别是那些由于长任务阻塞主线程而导致的延迟。
 * 实际上他是“从FCP -> TTI 的时间
 * @param list
 */
const onTBT = (list: IPerformanceEntry[]) => {
  try {
    list.forEach((entry) => {
      // 从 FCP 到 TTI 获取长耗时任务
      // 只统计 name === 'self' 的任务，表示耗时长任务来自于渲染帧
      // 只统计 FCP 之后的任务，因为 FCP 之前的阻塞不影响用户交互
      if (entry.name !== "self" || entry.startTime < fcp.value) {
        return;
      }

      // 长耗时任务意味着执行时间超过 50ms 的任务
      // 50ms 是长任务的阈值，超过这个时间的任务被认为会阻塞主线程
      // 参考文档：https://developer.mozilla.org/zh-CN/docs/Web/API/Long_Tasks_API
      const blockingTime = entry.duration - 50;

      // 只有当阻塞时间大于 0 时才累加到总阻塞时间中
      // 如果任务持续时间小于等于 50ms，则不会产生阻塞时间
      if (blockingTime > 0) {
        tbt.value += blockingTime;
      }

      console.log("TBT:", tbt.value);
    });
  } catch (error) {
    console.log("TBT error:", error);
  }
};
export default onTBT;
