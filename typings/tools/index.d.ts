export declare const isPerformanceSupported: () => boolean;
/**
 * 数值四舍五入到两位小数
 * 使用 toFixed(2) 方法进行精度控制，然后转换为浮点数
 *
 * @param num - 需要处理的数值
 * @returns 四舍五入到两位小数的浮点数
 */
export declare const roundByTwo: (num: number) => number;
/**
 * 将字节数转换为千字节（KB）
 * 将字节数除以 1024^2 得到 KB 值，并保留两位小数
 *
 * @param bytes - 字节数
 * @returns 转换后的 KB 值，如果输入无效则返回 null
 */
export declare const convertToKB: (bytes: number) => number | null;
//# sourceMappingURL=index.d.ts.map