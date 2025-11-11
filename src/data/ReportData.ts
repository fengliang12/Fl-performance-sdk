import { AskPriority } from "../types";
import { W, WN } from "./constants";

export default class ReportData {
  /** 日志上报的目标URL地址 */
  private logUrl: string;

  /** 传输方式：默认使用 beacon，在调试或不兼容场景可切换 */
  private transport: "beacon" | "fetch" | "image" | undefined;

  /** 批量上报队列（存储已序列化的 JSON 字符串） */
  private queue: string[] = [];

  /** 批量上报的定时器 */
  private flushTimer: number | null = null;

  /** 批量上报的时间间隔（毫秒） */
  private batchInterval: number = 2000;

  constructor(options: {
    logUrl: string;
    transport?: "beacon" | "fetch" | "image";
    batchInterval?: number;
  }) {
    this.logUrl = options.logUrl;
    this.transport = options.transport;
    if (typeof options.batchInterval === "number") {
      this.batchInterval = Math.max(500, options.batchInterval);
    }

    // 在页面隐藏或卸载时，及时刷新队列，避免数据丢失
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.flushQueue();
        }
      });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", () => this.flushQueue());
      window.addEventListener("beforeunload", () => this.flushQueue());
    }
  }

  /**
   * 发送原始字符串数据（不做聚合），根据传输方式选择实现
   */
  private sendRaw(level: AskPriority, body: string, uri?: string) {
    const fetchUrl = uri || this.logUrl;
    const transport = this.transport;

    // 优先规则：紧急数据尽量走 fetch（可见于 Network）
    if (level === AskPriority.URGENT || transport === "fetch") {
      if (!!W.fetch) {
        fetch(fetchUrl, {
          body,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
        }).catch(() => void 0);
        return;
      }
      // 降级到 XHR
      let xhr: XMLHttpRequest | null = new XMLHttpRequest();
      xhr.open("post", fetchUrl, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(body);
      xhr.onload = () => {
        xhr = null;
      };
      return;
    }

    // beacon 优先（仅在空闲、且未强制 fetch 时）
    if (level === AskPriority.IDLE && (transport === undefined || transport === "beacon")) {
      if (WN.sendBeacon) {
        const beaconPayload = new Blob([body], { type: "text/plain" });
        navigator.sendBeacon(fetchUrl, beaconPayload);
        return;
      }
    }

    // 图片像素兜底
    let img: HTMLImageElement | null = new Image();
    img.src = `${fetchUrl}?body=${encodeURIComponent(body)}`;
    img.onload = () => {
      img = null;
    };
  }

  /**
   * 入队并按批次发送（仅用于 IDLE 数据）
   */
  private enqueue(body: string) {
    this.queue.push(body);

    // 队列达到阈值时立即刷新
    if (this.queue.length >= 10) {
      this.flushQueue();
      return;
    }

    // 启动定时器，按时间窗口刷新
    if (this.flushTimer == null) {
      this.flushTimer = (setTimeout(() => {
        this.flushQueue();
      }, this.batchInterval) as unknown) as number;
    }
  }

  /**
   * 刷新队列：将多条 Idle 事件聚合为一个数组一次性发送
   */
  public flushQueue(uri?: string) {
    if (!this.queue.length) return;
    if (this.flushTimer != null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    // 聚合为数组结构，便于后端识别与映射
    const batch = this.queue.map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return { raw: s };
      }
    });
    this.queue = [];

    const body = JSON.stringify(batch);
    this.sendRaw(AskPriority.IDLE, body, uri);
  }

  /**
   * 发送数据到分析平台
   * @param level 上报优先级
   * @param body 上报数据体
   * @param uri 自定义上报URL，可选
   */
  public sendToAnalytics(level: AskPriority, body: string, uri?: string) {
    console.log(
      `[ 上报数据 ] ${level === AskPriority.URGENT ? "紧急‼️" : "空闲🧵"}`,
      JSON.parse(body)
    );
    // 紧急数据立即发送（可见于 Network）
    if (level === AskPriority.URGENT) {
      this.sendRaw(level, body, uri);
      return;
    }

    // 空闲数据进入队列，按批次发送
    this.enqueue(body);
  }
}
