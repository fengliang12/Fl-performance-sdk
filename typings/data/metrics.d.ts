import { IDataConsumption } from "../types/index";
/**
 * FCP (First Contentful Paint) 首次内容绘制指标
 * 用于衡量页面首次显示内容的时间，值越小表示页面加载越快
 */
export declare const fcp: {
    /** FCP 指标值，默认为 0 */
    value: number;
};
/**
 * LCP (Largest Contentful Paint) 最大内容绘制指标
 * 用于衡量页面主要内容加载完成的时间，值越小表示用户体验越好
 */
export declare const lcp: {
    /** LCP 指标值，默认为 0 */
    value: number;
};
/**
 * CLS (Cumulative Layout Shift) 累积布局偏移指标
 * 用于衡量页面的视觉稳定性，值越小表示页面越稳定
 */
export declare const cls: {
    /** CLS 指标值，默认为 0 */
    value: number;
};
/**
 * TBT (Total Blocking Time) 总阻塞时间指标
 * 用于衡量主线程被阻塞的总时间，值越小表示页面响应性越好
 * 这是衡量页面交互性能的重要指标
 */
export declare const tbt: {
    /** TBT 指标值，默认为 0 */
    value: number;
};
/**
 * 资源时间消耗统计对象
 * 用于跟踪不同类型资源的加载时间消耗
 */
export declare const rt: {
    value: IDataConsumption;
};
//# sourceMappingURL=metrics.d.ts.map