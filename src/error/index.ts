import { config } from "../config";
import { W } from "../data/constants";
import {
  AskPriority,
  IErrorInfo,
  IRRWebConfig,
  IRRWebRecording,
} from "../types";
import RRWebRecorder from "../rrweb/RRWebRecorder";

export default class ErrorMonitor {
  private rrwebRecorder?: RRWebRecorder; // RRWeb 录制器实例

  constructor(rrwebConfig?: Partial<IRRWebConfig>) {
    if (rrwebConfig?.enabled) {
      this.rrwebRecorder = new RRWebRecorder(rrwebConfig as IRRWebConfig);
      // 异步初始化录制器
      this.rrwebRecorder.init().then((success) => {
        if (success) {
          console.log("[ErrorMonitor] RRWeb 录制器初始化成功");
        } else {
          console.warn("[ErrorMonitor] RRWeb 录制器初始化失败");
        }
      });
    }
  }

  /**
   * 销毁错误监控器
   */
  destroy() {
    if (this.rrwebRecorder) {
      this.rrwebRecorder.stop();
    }
  }

  /**
   * 获取最近的录制数据
   */
  private getRecentRecording(): IRRWebRecording | undefined {
    if (this.rrwebRecorder) {
      const recording = this.rrwebRecorder.getRecentRecording();
      return recording || undefined;
    }
    return undefined;
  }

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
  private globalError() {
    W.onerror = (
      eventOrMessage: Event | string,
      scriptURI?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ): boolean => {
      console.log("[ ❌全局捕获错误 ]", eventOrMessage);
      const errorInfo: IErrorInfo = {
        scriptURI, // 错误发生的脚本URL
        lineno, // 行号
        colno, // 列号
        error, // 错误对象
        recording: this.getRecentRecording(), // 添加录制数据
      };

      // 通过接口上报错误信息
      config.reportData.sendToAnalytics(
        AskPriority.URGENT,
        JSON.stringify(errorInfo)
      );
      return true;
    };
  }

  /**
   * 网络错误捕获
   * window.onerror 无法捕获网络错误
   * 需要使用 addEventListener('error', handler, true) (捕获阶段)
   */
  private networkError() {
    W.addEventListener(
      "error",
      (e: ErrorEvent) => {
        if (e.target !== W) {
          console.log("[🖼网络错误]", e);
          const errorInfo: IErrorInfo = {
            scriptURI:
              (e.target as HTMLElement)?.getAttribute?.("src") ||
              (e.target as HTMLImageElement)?.currentSrc ||
              (e.target as HTMLScriptElement)?.src ||
              "", // 错误发生的脚本URL
            error: e.error, // 错误对象
            recording: this.getRecentRecording(), // 添加录制数据
          };
          // 通过接口上报错误信息
          config.reportData.sendToAnalytics(
            AskPriority.URGENT,
            JSON.stringify(errorInfo)
          );
        }
      },
      true
    );
  }

  /**
   * Promise 中的 rejection 错误捕获
   * window.onerror 无法捕获Promise 中的 rejection
   * 需要使用 window.onunhandledrejection 或 addEventListener('unhandledrejection')
   */
  private promiseError() {
    W.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
      console.log("[ 🙅promise 的错误了]", e);
      e.preventDefault();
      const errorInfo: IErrorInfo = {
        scriptURI: W.location.href, // Promise 错误通常发生在当前页面
        error: e.reason?.stack || e.reason,
        recording: this.getRecentRecording(), // 添加录制数据
      };
      // 通过接口上报错误信息
      config.reportData.sendToAnalytics(
        AskPriority.IDLE,
        JSON.stringify(errorInfo)
      );
      return true;
    });
  }

  /**
   * window.onerror 无法捕获 iframe 中的错误
   * 需要使用 addEventListener('error', handler, true) (捕获阶段)
   */
  private iframeError() {
    const frames = W.frames;
    for (let i = 0; i < frames.length; i++) {
      frames[i].addEventListener(
        "error",
        (e) => {
          console.log("iframe 错误", e);
          const errorInfo = JSON.stringify({
            scriptURI:
              e.target instanceof HTMLScriptElement ? e.target.src : "", // 错误发生的脚本URL
            lineno: e.lineno, // 行号
            colno: e.colno, // 列号
            error: e.error, // 错误对象
          });
          // 通过接口上报错误信息
          config.reportData.sendToAnalytics(AskPriority.IDLE, errorInfo);
        },
        true
      );

      frames[i].addEventListener(
        "unhandledrejection",
        function (e) {
          console.log("unhandledrejection", e);
        },
        true
      );
    }
  }

  /**
   * 重写 console.error 方法，将错误信息上报到接口
   */
  private consoleReflect() {
    const console_error = W.console.error;
    W.console.error = function (error) {
      console.log("console.error", error);
      const errorInfo = JSON.stringify({
        error, // 错误对象
      });
      // 通过接口上报错误信息
      config.reportData.sendToAnalytics(AskPriority.IDLE, errorInfo);
      console_error.apply(window, error);
    };
  }

  public init() {
    this.networkError();
    //触发全体数据监听错误
    this.globalError();
    //触发promise的错误
    this.promiseError();
    //触发iframe的错误
    this.iframeError();
    //触发console.error的错误
    this.consoleReflect();
  }
}
