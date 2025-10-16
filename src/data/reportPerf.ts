import { config } from "../config";
import { getNavigatorInfo } from "../helpers/getNavigatorInfo";
import { visibility } from "../helpers/onVisibilityChange";
import { getVitalsScore } from "../helpers/vitalsScore";
import { W } from "./constants";

/**
 * 报告性能指标到自定义分析服务
 * 当页面可见时，将指定的性能指标数据发送到配置的分析跟踪器
 *
 * @param measureName - 指标名称，用于标识具体的性能指标
 * @param data - 指标数据，具体格式根据分析服务要求而定
 * @param customProperties - 可选的自定义属性对象，用于添加额外的上下文信息
 */
export const reportPerf = (
  measureName: string,
  data: any,
  customProperties?: object
): void => {
  function fn() {
    // 当页面被隐藏且不是最终指标时，或者没有配置分析跟踪器时，不报告具体数据
    if (
      (visibility.isHidden && measureName.indexOf("Final") < 0) ||
      !config.analyticsTracker
    ) {
      return;
    }

    config.analyticsTracker({
      metricName: measureName,
      data,
      eventProperties: customProperties || {},
      navigatorInformation: getNavigatorInfo(),
      vitalsScore: getVitalsScore(measureName, data),
    });
  }

  // 检查浏览器是否支持 requestIdleCallback API
  if ("requestIdleCallback" in W) {
    // 使用 requestIdleCallback 在浏览器空闲时执行任务
    // timeout: 3000 表示最多等待 3 秒，如果一直没有空闲时间则强制执行
    (W as any).requestIdleCallback(fn, { timeout: 3000 });
  } else {
    // 浏览器不支持 requestIdleCallback，立即执行回调函数
    fn();
  }
};
