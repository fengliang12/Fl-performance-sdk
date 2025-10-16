/**
 * 报告性能指标到自定义分析服务
 * 当页面可见时，将指定的性能指标数据发送到配置的分析跟踪器
 *
 * @param measureName - 指标名称，用于标识具体的性能指标
 * @param data - 指标数据，具体格式根据分析服务要求而定
 * @param customProperties - 可选的自定义属性对象，用于添加额外的上下文信息
 */
export declare const reportPerf: (measureName: string, data: any, customProperties?: object) => void;
//# sourceMappingURL=reportPerf.d.ts.map