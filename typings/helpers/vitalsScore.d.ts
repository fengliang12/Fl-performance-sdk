import { IPerformanceMonitorData, IVitalsScore } from "../types";
/**
 * Web Vitals 评分标准映射表
 * 将各种性能指标名称映射到对应的评分阈值数组
 * 每个阈值数组包含两个值：[优秀阈值, 需要改进阈值]
 */
export declare const webVitalsScore: Record<string, number[]>;
/**
 * 根据性能指标名称和值计算 Web Vitals 评分
 * 将数值性能指标转换为可读的质量等级
 *
 * @param measureName - 性能指标名称，如 'fcp'、'lcp'、'cls' 等
 * @param value - 性能指标的具体数值
 * @returns 性能评分等级：'good'（优秀）、'needsImprovement'（需要改进）、'poor'（较差）或 null（未知指标）
 */
export declare const getVitalsScore: (measureName: string, value: IPerformanceMonitorData) => IVitalsScore;
//# sourceMappingURL=vitalsScore.d.ts.map