import logMetric from "../data/log";
import { IPerformanceEntry } from "../types";

/**
 * INP 交互延迟追踪
 * 用于存储和计算页面的交互延迟指标
 */
let inpValue = 0;
let maxInteractionDelay = 0;
const interactionDelays: number[] = [];

const onINP = (list: IPerformanceEntry[]) => {
  list.forEach((entry) => {
    // 只处理用户交互事件 包括：pointerdown、pointerup、click、keydown、keyup 等
    if (!entry.interactionId) {
      return;
    }

    // 计算交互延迟时间
    // duration 包含了从事件开始到浏览器能够绘制下一帧的总时间
    // 这是 INP 的核心指标：交互到下一次绘制的时间
    const interactionDelay = entry.duration;

    // 确保延迟时间有效
    if (interactionDelay > 0) {
      // 将交互延迟添加到数组中，用于后续计算百分位数
      interactionDelays.push(interactionDelay);

      // 更新最大交互延迟（用于简单场景的快速参考）
      maxInteractionDelay = Math.max(maxInteractionDelay, interactionDelay);

      // 根据 Web Vitals 规范，INP 取所有交互延迟的第98百分位数
      inpValue = calculatePercentile(interactionDelays, 98);

      // 记录当前的 INP 值
      // 由于 INP 会随着用户交互持续更新，我们记录每次更新的值
      logMetric({
        duration: inpValue,
        measureName: "inp",
        customProperties: {
          performanceEntry: entry,
          maxDelay: maxInteractionDelay,
          totalInteractions: interactionDelays.length,
        },
      });
    }
  });
};

/**
 * 计算数组的指定百分位数
 *
 * @param values - 数值数组
 * @param percentile - 百分位数（0-100）
 * @returns 指定百分位数的值
 */
const calculatePercentile = (values: number[], percentile: number): number => {
  if (values.length === 0) {
    return 0;
  }

  // 对数组进行排序
  const sortedValues = [...values].sort((a, b) => a - b);

  // 计算百分位数的索引
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;

  // 返回对应索引的值
  return sortedValues[Math.max(0, index)] || 0;
};

/**
 * 获取当前 INP 值
 * 用于在页面卸载或其他需要最终 INP 值的场景中获取数据
 *
 * @returns 当前的 INP 值和相关统计信息
 */
export const getINPValue = () => {
  return {
    value: inpValue,
    maxDelay: maxInteractionDelay,
    totalInteractions: interactionDelays.length,
    allDelays: [...interactionDelays],
  };
};

export default onINP;
