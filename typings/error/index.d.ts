import { IRRWebConfig } from "../types";
export default class ErrorMonitor {
    private rrwebRecorder?;
    constructor(rrwebConfig?: Partial<IRRWebConfig>);
    /**
     * 销毁错误监控器
     */
    destroy(): void;
    /**
     * 获取最近的录制数据
     */
    private getRecentRecording;
    /**
     * 基于window.onerror全局捕获同步+异步错误
     * 语法错误(已加载脚本中的)、引用错误 (ReferenceError)、类型错误 (TypeError)、范围错误 (RangeError)、URI错误 (URIError)
     * 同步代码中的错误
     * javascript   // 可以捕获
     * undefined.property; // TypeError
     * nonExistentFunction(); // ReferenceError
     * 异步代码中未捕获的错误  setTimeout(() => { throw new Error("异步错误"); }, 0);
     *
     * 无法捕获的错误
     * Promise 中的 rejection
     * 网络错误
     * 图片、脚本等资源加载失败
     * 需要使用 addEventListener('error', handler, true) (捕获阶段)
     */
    private globalError;
    /**
     * 网络错误捕获
     * window.onerror 无法捕获网络错误
     * 需要使用 addEventListener('error', handler, true) (捕获阶段)
     */
    private networkError;
    /**
     * Promise 中的 rejection 错误捕获
     * window.onerror 无法捕获Promise 中的 rejection
     * 需要使用 window.onunhandledrejection 或 addEventListener('unhandledrejection')
     */
    private promiseError;
    /**
     * window.onerror 无法捕获 iframe 中的错误
     * 需要使用 addEventListener('error', handler, true) (捕获阶段)
     */
    private iframeError;
    /**
     * 重写 console.error 方法，将错误信息上报到接口
     */
    private consoleReflect;
    init(): void;
}
//# sourceMappingURL=index.d.ts.map