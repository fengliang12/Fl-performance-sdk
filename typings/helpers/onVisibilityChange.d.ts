/**
 * 页面可见性状态管理对象
 * 用于跟踪页面的可见性状态，避免在页面隐藏时发送错误的性能数据
 */
export declare const visibility: {
    /** 页面是否处于隐藏状态，默认为 false（可见） */
    isHidden: boolean;
};
/**
 * 页面可见性变化事件处理函数
 *
 * 该函数只在页面变为隐藏状态时执行回调，这样设计的原因是：
 * 1. 避免在页面隐藏时发送错误的性能数据或日志
 * 2. 确保性能监控的准确性，因为隐藏页面的性能数据可能不准确
 * 3. 优化资源使用，在页面不可见时停止不必要的性能监控
 *
 * 使用场景：
 * - 当用户切换到其他标签页时
 * - 当用户最小化浏览器窗口时
 * - 当页面被其他应用遮挡时
 *
 * @param cb - 页面隐藏时要执行的回调函数，通常用于停止性能监控
 */
export declare const didVisibilityChange: (cb: Function) => void;
//# sourceMappingURL=onVisibilityChange.d.ts.map