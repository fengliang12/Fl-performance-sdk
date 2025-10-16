import { AskPriority } from "../types";
import { W, WN } from "./constants";

export default class ReportData {
  /** 日志上报的目标URL地址 */
  private logUrl: string;

  constructor(options: { logUrl: string }) {
    this.logUrl = options.logUrl;
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

    let fetchUrl = uri || this.logUrl;

    // 紧急数据上报：需要立即发送的重要数据
    if (level === AskPriority.URGENT) {
      // 优先使用 fetch API，支持 keepalive 选项
      if (!!W.fetch) {
        fetch(fetchUrl, {
          body,
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          keepalive: true, // 确保页面关闭后请求仍能完成
        });
      } else {
        // 降级到 XMLHttpRequest
        let xhr: XMLHttpRequest | null = new XMLHttpRequest();
        xhr.open("post", fetchUrl, true);
        // 设置请求头，指定内容类型为 JSON
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(body); // 发送参数

        xhr.onload = (e) => {
          e;
          xhr = null;
        };
      }
    } else if (level === AskPriority.IDLE) {
      // 空闲数据上报：可以在空闲时发送的非紧急数据
      // 优先使用 sendBeacon API，专为数据上报设计
      if (WN.sendBeacon) {
        navigator.sendBeacon(fetchUrl, body);
      } else {
        // 降级到图片请求方式，兼容性最好
        let img: HTMLImageElement | null = new Image();
        img.src = `${fetchUrl}?body=${body}`;
        img.onload = () => {
          // 统计完成收回创建的元素，防止内存泄露
          img = null;
        };
      }
    }
  }
}
