import { WP } from "../data/constants";

export const isPerformanceSupported = (): boolean => {
  // 检查 performance 对象是否存在
  // 检查 getEntriesByType 方法是否可用（Navigation Timing API）
  // 检查 now 方法是否可用（高精度时间戳）
  // 检查 mark 方法是否可用（User Timing API）
  return WP && !!WP.getEntriesByType && !!WP.now && !!WP.mark;
};

/**
 * 数值四舍五入到两位小数
 * 使用 toFixed(2) 方法进行精度控制，然后转换为浮点数
 *
 * @param num - 需要处理的数值
 * @returns 四舍五入到两位小数的浮点数
 */
export const roundByTwo = (num: number) => {
  return parseFloat(num.toFixed(2));
};

/**
 * 将字节数转换为千字节（KB）
 * 将字节数除以 1024^2 得到 KB 值，并保留两位小数
 *
 * @param bytes - 字节数
 * @returns 转换后的 KB 值，如果输入无效则返回 null
 */
export const convertToKB = (bytes: number): number | null => {
  // 验证输入参数是否为有效数字
  if (typeof bytes !== "number") {
    return null;
  }

  // 将字节转换为 KB：1 KB = 1024^2 字节
  // 使用 roundByTwo 函数保留两位小数
  return roundByTwo(bytes / Math.pow(1024, 2));
};
