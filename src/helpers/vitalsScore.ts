// Web Vitals 评分标准阈值定义
// 参考标准：https://web.dev/vitals/
// 这些阈值用于评估网页性能指标的质量等级

import { IPerformanceMonitorData, IVitalsScore } from "../types";

// TTFB (Time to First Byte) 评分阈值：1000ms 为优秀，2500ms 为需要改进
const ttfbScore = [200, 500];

// FCP (First Contentful Paint) 评分阈值：1000ms 为优秀，2500ms 为需要改进
const fcpScore = [1000, 2500];

// LCP (Largest Contentful Paint) 评分阈值：2500ms 为优秀，4000ms 为需要改进
const lcpScore = [2500, 4000];

// FID (First Input Delay) 评分阈值：100ms 为优秀，300ms 为需要改进
const fidcore = [100, 300];

// CLS (Cumulative Layout Shift) 评分阈值：0.1 为优秀，0.25 为需要改进
// CLS (Cumulative Layout Shift) 的阈值 [0.1, 0.25] 既不是毫秒也不是秒，而是一个无单位的分数值。
// CLS 是无单位的分数 ：CLS 测量的是页面布局偏移的累积分数，范围通常在 0 到无穷大之间，但大多数网站的 CLS 值都在 0-1 之间。
const clsScore = [0.1, 0.25];

// TBT (Total Blocking Time) 评分阈值：300ms 为优秀，600ms 为需要改进
// TBT 是一个累加值，项目中的长任务（Long Task） 用于衡量页面在加载过程中阻塞用户交互的时间。
const tbtScore = [300, 600];

/**
 * Web Vitals 评分标准映射表
 * 将各种性能指标名称映射到对应的评分阈值数组
 * 每个阈值数组包含两个值：[优秀阈值, 需要改进阈值]
 */
export const webVitalsScore: Record<string, number[]> = {
  ttfb: ttfbScore,

  fp: fcpScore,
  fcp: fcpScore,

  lcp: lcpScore,
  lcpFinal: lcpScore,

  fid: fidcore,
  fidVitals: fidcore,

  cls: clsScore,
  clsFinal: clsScore,

  tbt: tbtScore,
  tbt5S: tbtScore,
  tbt10S: tbtScore,
  tbtFinal: tbtScore,
};

/**
 * 根据性能指标名称和值计算 Web Vitals 评分
 * 将数值性能指标转换为可读的质量等级
 *
 * @param measureName - 性能指标名称，如 'fcp'、'lcp'、'cls' 等
 * @param value - 性能指标的具体数值
 * @returns 性能评分等级：'good'（优秀）、'needsImprovement'（需要改进）、'poor'（较差）或 null（未知指标）
 */
export const getVitalsScore = (
  measureName: string,
  value: IPerformanceMonitorData
): IVitalsScore => {
  // 检查指标名称是否在评分标准中存在
  if (!webVitalsScore[measureName]) {
    return null;
  }

  // 获取该指标的评分阈值
  const thresholds = webVitalsScore[measureName];

  if ((value as number) <= thresholds[0]) {
    // 数值小于等于第一个阈值，评为优秀
    return "good";
  } else if ((value as number) <= thresholds[1]) {
    // 数值小于等于第二个阈值，评为需要改进
    return "needsImprovement";
  } else {
    // 数值大于第二个阈值，评为较差
    return "poor";
  }
};
