import { PerformanceMonitor } from '../src/core/performance-monitor';
import { PerformanceConfig } from '../src/types';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  let config: PerformanceConfig;

  beforeEach(() => {
    config = {
      appId: 'test-app',
      debug: true,
      autoCollect: false, // 禁用自动收集以便测试
      sampleRate: 1.0
    };
    monitor = new PerformanceMonitor(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    it('应该正确初始化配置', () => {
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
    });

    it('应该使用默认配置', () => {
      const defaultMonitor = new PerformanceMonitor({ appId: 'test' });
      expect(defaultMonitor).toBeInstanceOf(PerformanceMonitor);
    });
  });

  describe('指标记录', () => {
    it('应该能记录指标', () => {
      const metric = {
        name: 'test_metric',
        value: 100,
        timestamp: Date.now(),
        type: 'gauge' as const
      };

      monitor.recordMetric(metric);
      const metrics = monitor.getMetrics();
      
      expect(metrics).toHaveLength(1);
      expect(metrics[0]).toEqual(metric);
    });

    it('应该能记录带标签的指标', () => {
      const metric = {
        name: 'test_metric',
        value: 100,
        timestamp: Date.now(),
        type: 'gauge' as const,
        tags: { category: 'test' }
      };

      monitor.recordMetric(metric);
      const metrics = monitor.getMetrics();
      
      expect(metrics[0].tags).toEqual({ category: 'test' });
    });

    it('应该根据采样率过滤指标', () => {
      const lowSampleConfig = { ...config, sampleRate: 0 };
      const lowSampleMonitor = new PerformanceMonitor(lowSampleConfig);

      // 由于采样率为 0，应该不记录任何指标
      lowSampleMonitor.recordMetric({
        name: 'test_metric',
        value: 100,
        timestamp: Date.now(),
        type: 'gauge'
      });

      expect(lowSampleMonitor.getMetrics()).toHaveLength(0);
    });
  });

  describe('错误记录', () => {
    it('应该能记录错误信息', () => {
      const errorInfo = {
        message: 'Test error',
        stack: 'Error stack trace',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
        timestamp: Date.now()
      };

      monitor.recordError(errorInfo);
      const metrics = monitor.getMetrics();
      
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe('javascript_error');
      expect(metrics[0].value).toBe(1);
      expect(metrics[0].tags?.message).toBe('Test error');
    });
  });

  describe('用户行为记录', () => {
    it('应该能记录用户行为', () => {
      const userAction = {
        type: 'click' as const,
        target: '#button',
        timestamp: Date.now()
      };

      monitor.recordUserAction(userAction);
      const metrics = monitor.getMetrics();
      
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe('user_action_click');
      expect(metrics[0].value).toBe(1);
      expect(metrics[0].tags?.target).toBe('#button');
    });
  });

  describe('指标管理', () => {
    it('应该能获取所有指标', () => {
      monitor.recordMetric({
        name: 'metric1',
        value: 100,
        timestamp: Date.now(),
        type: 'gauge'
      });

      monitor.recordMetric({
        name: 'metric2',
        value: 200,
        timestamp: Date.now(),
        type: 'counter'
      });

      const metrics = monitor.getMetrics();
      expect(metrics).toHaveLength(2);
    });

    it('应该能清空指标', () => {
      monitor.recordMetric({
        name: 'test_metric',
        value: 100,
        timestamp: Date.now(),
        type: 'gauge'
      });

      expect(monitor.getMetrics()).toHaveLength(1);
      
      monitor.clearMetrics();
      expect(monitor.getMetrics()).toHaveLength(0);
    });
  });

  describe('指标发送', () => {
    it('应该能发送指标到服务器', async () => {
      const configWithEndpoint = {
        ...config,
        apiEndpoint: 'https://api.example.com/metrics'
      };
      const monitorWithEndpoint = new PerformanceMonitor(configWithEndpoint);

      monitorWithEndpoint.recordMetric({
        name: 'test_metric',
        value: 100,
        timestamp: Date.now(),
        type: 'gauge'
      });

      await monitorWithEndpoint.sendMetrics();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/metrics',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
    });

    it('没有配置 API 端点时应该跳过发送', async () => {
      monitor.recordMetric({
        name: 'test_metric',
        value: 100,
        timestamp: Date.now(),
        type: 'gauge'
      });

      await monitor.sendMetrics();

      expect(fetch).not.toHaveBeenCalled();
    });

    it('发送成功后应该清空指标', async () => {
      const configWithEndpoint = {
        ...config,
        apiEndpoint: 'https://api.example.com/metrics'
      };
      const monitorWithEndpoint = new PerformanceMonitor(configWithEndpoint);

      monitorWithEndpoint.recordMetric({
        name: 'test_metric',
        value: 100,
        timestamp: Date.now(),
        type: 'gauge'
      });

      expect(monitorWithEndpoint.getMetrics()).toHaveLength(1);
      
      await monitorWithEndpoint.sendMetrics();
      
      expect(monitorWithEndpoint.getMetrics()).toHaveLength(0);
    });
  });
});