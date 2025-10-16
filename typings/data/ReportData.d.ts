import { AskPriority } from "../types";
export default class ReportData {
    /** 日志上报的目标URL地址 */
    private logUrl;
    constructor(options: {
        logUrl: string;
    });
    /**
     * 发送数据到分析平台
     * @param level 上报优先级
     * @param body 上报数据体
     * @param uri 自定义上报URL，可选
     */
    sendToAnalytics(level: AskPriority, body: string, uri?: string): void;
}
//# sourceMappingURL=ReportData.d.ts.map