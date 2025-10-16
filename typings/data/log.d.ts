interface LogMetricOptions {
    measureName: string;
    metric: any;
    customProperties?: object;
}
/**
 * 记录并上报性能指标数据
 * 将传入的指标数据中的数值进行四舍五入处理，然后发送到外部跟踪服务
 *
 * @param measureName - 指标名称，用于标识不同类型的性能数据
 * @param metric - 指标数据对象，包含各种性能指标值
 * @param customProperties - 可选的自定义属性，用于添加额外的上下文信息
 */
export declare const logMetricObject: ({ measureName, metric, customProperties, }: LogMetricOptions) => void;
interface LatencyMode {
    duration: number;
    measureName: string;
    customProperties?: object;
}
declare const logMetric: (options: LatencyMode) => void;
export default logMetric;
//# sourceMappingURL=log.d.ts.map