import { IRRWebRecording, IRRWebConfig } from "../types";
/**
 * RRWeb 录制器类 - 简化版本，仅支持 SDK 自动加载
 */
export declare class RRWebRecorder {
    private events;
    private stopRecording?;
    private config;
    constructor(config: IRRWebConfig);
    /**
     * 初始化录制器
     */
    init(): Promise<boolean>;
    /**
     * 检查 rrweb 是否可用
     */
    private isRRWebAvailable;
    /**
     * 动态加载 rrweb 库
     */
    private loadRRWebDynamically;
    /**
     * 开始录制
     */
    private startRecording;
    /**
     * 获取最近的录制数据
     */
    getRecentRecording(): IRRWebRecording | undefined;
    /**
     * 停止录制
     */
    stop(): void;
}
export default RRWebRecorder;
//# sourceMappingURL=RRWebRecorder.d.ts.map