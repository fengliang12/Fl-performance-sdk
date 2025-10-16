// Jest 测试环境设置

// 模拟浏览器 API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    timing: {
      navigationStart: 1000,
      domainLookupStart: 1010,
      domainLookupEnd: 1020,
      connectStart: 1020,
      connectEnd: 1030,
      requestStart: 1030,
      responseStart: 1040,
      responseEnd: 1050,
      domLoading: 1050,
      domContentLoadedEventEnd: 1100,
      loadEventStart: 1150,
      loadEventEnd: 1200
    },
    getEntriesByType: jest.fn(() => [])
  },
  writable: true
});

// 模拟 PerformanceObserver
(globalThis as any).PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// 模拟 fetch
(globalThis as any).fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({})
  })
) as jest.Mock;

// 清理函数
afterEach(() => {
  jest.clearAllMocks();
});