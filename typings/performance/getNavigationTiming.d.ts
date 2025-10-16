/**
 * 获取页面导航时间性能指标
 *
 * Navigation Timing API 提供了 HTML 文档的性能指标数据。
 * 该 API 可以详细测量页面加载过程中的各个阶段耗时。
 *
 * 相关文档：
 * - W3C 规范：https://w3c.github.io/navigation-timing/
 * - Google 开发者指南：https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing
 *
 * @returns 包含各种导航时间指标的对象，如果浏览器不支持则返回空对象
 */
declare const getNavigationTiming: () => {
    fetchTime?: undefined;
    workerTime?: undefined;
    totalTime?: undefined;
    downloadTime?: undefined;
    timeToFirstByte?: undefined;
    headerSize?: undefined;
    dnsLookupTime?: undefined;
    tcpTime?: undefined;
    whiteTime?: undefined;
    domTime?: undefined;
    loadTime?: undefined;
    parseDomTime?: undefined;
} | {
    fetchTime: number;
    workerTime: number;
    totalTime: number;
    downloadTime: number;
    timeToFirstByte: number;
    headerSize: number;
    dnsLookupTime: number;
    tcpTime: number;
    whiteTime: number;
    domTime: number;
    loadTime: number;
    parseDomTime: number;
};
export default getNavigationTiming;
//# sourceMappingURL=getNavigationTiming.d.ts.map