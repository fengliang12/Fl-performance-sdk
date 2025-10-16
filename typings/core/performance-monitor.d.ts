import { PerformanceConfig, PerformanceMetric, ErrorInfo, UserAction } from '../types';
export declare class PerformanceMonitor {
    private config;
    private metrics;
    private isInitialized;
    constructor(config: PerformanceConfig);
    /**
     * 初始化监控
     */
    private init;
    /**
     * 设置自动收集
     */
    private setupAutoCollection;
    /**
     * 收集导航时序
     */
    private collectNavigationTiming;
    /**
     * 观察资源时序
     */
    private observeResourceTiming;
    /**
     * 观察错误
     */
    private observeErrors;
    /**
     * 观察用户行为
     */
    private observeUserActions;
    /**
     * 记录指标
     */
    recordMetric(metric: PerformanceMetric): void;
    /**
     * 记录错误
     */
    recordError(error: ErrorInfo): void;
    /**
     * 记录用户行为
     */
    recordUserAction(action: UserAction): void;
    /**
     * 获取所有指标
     */
    getMetrics(): PerformanceMetric[];
    /**
     * 清空指标
     */
    clearMetrics(): void;
    /**
     * 发送指标到服务器
     */
    sendMetrics(metrics?: PerformanceMetric[]): Promise<void>;
    /**
     * 获取资源类型
     */
    private getResourceType;
    /**
     * 获取元素选择器
     */
    private getElementSelector;
    /**
     * 日志输出
     */
    private log;
}
//# sourceMappingURL=performance-monitor.d.ts.map