import { AskPriority } from "../types";
export default class ReportData {
    /** 日志上报的目标URL地址 */
    private logUrl;
    /** 传输方式：默认使用 beacon，在调试或不兼容场景可切换 */
    private transport;
    /** 批量上报队列（存储已序列化的 JSON 字符串） */
    private queue;
    /** 批量上报的定时器 */
    private flushTimer;
    /** 批量上报的时间间隔（毫秒） */
    private batchInterval;
    constructor(options: {
        logUrl: string;
        transport?: "beacon" | "fetch" | "image";
        batchInterval?: number;
    });
    /**
     * 发送原始字符串数据（不做聚合），根据传输方式选择实现
     */
    private sendRaw;
    /**
     * 入队并按批次发送（仅用于 IDLE 数据）
     */
    private enqueue;
    /**
     * 刷新队列：将多条 Idle 事件聚合为一个数组一次性发送
     */
    flushQueue(uri?: string): void;
    /**
     * 发送数据到分析平台
     * @param level 上报优先级
     * @param body 上报数据体
     * @param uri 自定义上报URL，可选
     */
    sendToAnalytics(level: AskPriority, body: string, uri?: string): void;
}
//# sourceMappingURL=ReportData.d.ts.map