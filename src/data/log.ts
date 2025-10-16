import { config } from "../config";
import { roundByTwo } from "../tools";
import { reportPerf } from "./reportPerf";

interface LogMetricOptions {
  measureName: string;
  metric: any;
  customProperties?: object;
}
/**
 * 记录并上报性能指标数据
 * 将传入的指标数据中的数值进行四舍五入处理，然后发送到外部跟踪服务
 *
 * @param measureName - 指标名称，用于标识不同类型的性能数据
 * @param metric - 指标数据对象，包含各种性能指标值
 * @param customProperties - 可选的自定义属性，用于添加额外的上下文信息
 */
export const logMetricObject = ({
  measureName,
  metric,
  customProperties,
}: LogMetricOptions): void => {
  // 遍历指标对象的所有属性，对数值类型的属性进行精度处理
  Object.keys(metric).forEach((key) => {
    if (typeof metric[key] === "number") {
      // 将数值四舍五入到两位小数，提高数据的一致性和可读性
      metric[key] = roundByTwo(metric[key]);
    }
  });

  // 将处理后的指标数据发送到外部跟踪服务
  reportPerf(measureName, metric, customProperties);
};

interface LatencyMode {
  duration: number;
  measureName: string;
  customProperties?: object;
}

const logMetric = (options: LatencyMode) => {
  let { duration, measureName, customProperties } = options;
  // 将持续时间四舍五入到两位小数
  const duration2Decimal = roundByTwo(duration);

  if (duration2Decimal > 0 && duration2Decimal <= config.maxTime) {
    reportPerf(measureName, duration2Decimal, customProperties);
  }
};
export default logMetric;
