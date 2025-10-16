import { IRRWebRecording, IRRWebConfig } from "../types";

/**
 * RRWeb 录制器类 - 简化版本，仅支持 SDK 自动加载
 */
export class RRWebRecorder {
  private events: any[] = [];
  private stopRecording?: () => void;
  private config: IRRWebConfig;

  constructor(config: IRRWebConfig) {
    const defaultConfig: IRRWebConfig = {
      enabled: false, // 是否启用 rrweb 录制
      maxDuration: 10, // 最大录制时长（秒）
      maxEvents: 300, // 最大事件数量
      sampling: {
        scroll: 100, // 滚动事件采样率
        mousemove: 50, // 鼠标移动事件采样率
        input: 100, // 输入事件采样率
      },
    };

    this.config = { ...defaultConfig, ...config };
  }

  /**
   * 初始化录制器
   */
  public async init(): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    // 检查 rrweb 是否已经可用
    if (this.isRRWebAvailable()) {
      return this.startRecording();
    }

    // 动态加载 rrweb
    const loaded = await this.loadRRWebDynamically();
    if (loaded) {
      return this.startRecording();
    }

    console.error("[RRWebRecorder] 无法加载 rrweb 库");
    return false;
  }

  /**
   * 检查 rrweb 是否可用
   */
  private isRRWebAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      (window as any).rrweb &&
      typeof (window as any).rrweb.record === "function"
    );
  }

  /**
   * 动态加载 rrweb 库
   */
  private async loadRRWebDynamically(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js";
      script.onload = () => resolve(this.isRRWebAvailable());
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  /**
   * 开始录制
   */
  private startRecording(): boolean {
    try {
      const { record } = (window as any).rrweb;

      this.stopRecording = record({
        emit: (event: any) => {
          this.events.push(event);

          // 限制事件数量
          if (this.events.length > this.config.maxEvents) {
            this.events.shift();
          }
        },
        sampling: this.config.sampling,
      });

      return true;
    } catch (error) {
      console.error("[RRWebRecorder] 开始录制失败:", error);
      return false;
    }
  }

  /**
   * 获取最近的录制数据
   */
  public getRecentRecording(): IRRWebRecording | undefined {
    if (this.events.length === 0) {
      return undefined;
    }

    const now = Date.now();
    const maxDurationMs = this.config.maxDuration * 1000;

    const recentEvents = this.events.filter((event) => {
      return now - event.timestamp <= maxDurationMs;
    });

    if (recentEvents.length === 0) {
      return undefined;
    }

    return {
      events: recentEvents,
      startTime: recentEvents[0].timestamp,
      endTime: recentEvents[recentEvents.length - 1].timestamp,
      duration:
        recentEvents[recentEvents.length - 1].timestamp -
        recentEvents[0].timestamp,
      compressed: false,
    };
  }

  /**
   * 停止录制
   */
  public stop(): void {
    if (this.stopRecording) {
      this.stopRecording();
      this.stopRecording = undefined;
    }
  }
}

export default RRWebRecorder;
