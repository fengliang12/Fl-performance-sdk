/**
 * 生成唯一 ID
 */
export declare function generateId(): string;
/**
 * 获取当前时间戳
 */
export declare function now(): number;
/**
 * 防抖函数
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 节流函数
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * 检查是否为浏览器环境
 */
export declare function isBrowser(): boolean;
/**
 * 安全的 JSON 序列化
 */
export declare function safeStringify(obj: any): string;
/**
 * 深度合并对象
 */
export declare function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T;
//# sourceMappingURL=index.d.ts.map