import { 
  PerformanceConfig, 
  PerformanceMetric, 
  NavigationTiming, 
  ResourceTiming, 
  ErrorInfo,
  UserAction 
} from '../types';
import { now, isBrowser, debounce } from '../utils';

export class PerformanceMonitor {
  private config: Required<PerformanceConfig>;
  private metrics: PerformanceMetric[] = [];
  private isInitialized = false;

  constructor(config: PerformanceConfig) {
    this.config = {
      apiEndpoint: '',
      autoCollect: true,
      sampleRate: 1.0,
      debug: false,
      ...config
    };

    if (isBrowser()) {
      this.init();
    }
  }

  /**
   * 初始化监控
   */
  private init(): void {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (this.config.autoCollect) {
      this.setupAutoCollection();
    }

    this.log('Performance monitor initialized');
  }

  /**
   * 设置自动收集
   */
  private setupAutoCollection(): void {
    // 监听页面加载完成
    if (document.readyState === 'complete') {
      this.collectNavigationTiming();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectNavigationTiming(), 0);
      });
    }

    // 监听资源加载
    this.observeResourceTiming();

    // 监听错误
    this.observeErrors();

    // 监听用户交互
    this.observeUserActions();
  }

  /**
   * 收集导航时序
   */
  private collectNavigationTiming(): void {
    if (!performance.timing) {
      return;
    }

    const timing = performance.timing;

    const navigationTiming: NavigationTiming = {
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnect: timing.connectEnd - timing.connectStart,
      request: timing.responseStart - timing.requestStart,
      response: timing.responseEnd - timing.responseStart,
      domParse: timing.domContentLoadedEventEnd - timing.domLoading,
      resourceLoad: timing.loadEventEnd - timing.loadEventStart
    };

    // 收集 Paint Timing
    if ('getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          navigationTiming.firstContentfulPaint = entry.startTime;
        }
      });

      // 收集 LCP
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            if (lastEntry) {
              navigationTiming.largestContentfulPaint = lastEntry.startTime;
              this.recordMetric({
                name: 'largest_contentful_paint',
                value: lastEntry.startTime,
                timestamp: now(),
                type: 'timing'
              });
            }
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP not supported
        }
      }
    }

    // 记录各项指标
    Object.entries(navigationTiming).forEach(([key, value]) => {
      if (typeof value === 'number' && value > 0) {
        this.recordMetric({
          name: `navigation_${key}`,
          value,
          timestamp: now(),
          type: 'timing'
        });
      }
    });
  }

  /**
   * 观察资源时序
   */
  private observeResourceTiming(): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const resourceTiming: ResourceTiming = {
            name: entry.name,
            type: this.getResourceType(entry.name),
            startTime: entry.startTime,
            duration: entry.duration,
            transferSize: entry.transferSize || 0
          };

          this.recordMetric({
            name: 'resource_timing',
            value: resourceTiming.duration,
            timestamp: now(),
            type: 'timing',
            tags: {
              resource_name: resourceTiming.name,
              resource_type: resourceTiming.type
            }
          });
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      this.log('Resource timing observation failed', e);
    }
  }

  /**
   * 观察错误
   */
  private observeErrors(): void {
    // JavaScript 错误
    window.addEventListener('error', (event) => {
      const errorInfo: ErrorInfo = {
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: now()
      };

      this.recordError(errorInfo);
    });

    // Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo: ErrorInfo = {
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: now()
      };

      this.recordError(errorInfo);
    });
  }

  /**
   * 观察用户行为
   */
  private observeUserActions(): void {
    const debouncedScroll = debounce(() => {
      this.recordUserAction({
        type: 'scroll',
        timestamp: now()
      });
    }, 100);

    // 点击事件
    document.addEventListener('click', (event) => {
      this.recordUserAction({
        type: 'click',
        target: this.getElementSelector(event.target as Element),
        timestamp: now()
      });
    });

    // 滚动事件
    window.addEventListener('scroll', debouncedScroll);
  }

  /**
   * 记录指标
   */
  public recordMetric(metric: PerformanceMetric): void {
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    this.metrics.push(metric);
    this.log('Metric recorded:', metric);

    // 自动发送（可选）
    if (this.config.apiEndpoint) {
      this.sendMetrics([metric]);
    }
  }

  /**
   * 记录错误
   */
  public recordError(error: ErrorInfo): void {
    this.recordMetric({
      name: 'javascript_error',
      value: 1,
      timestamp: error.timestamp,
      type: 'counter',
      tags: {
        message: error.message,
        filename: error.filename || '',
        lineno: String(error.lineno || 0)
      }
    });
  }

  /**
   * 记录用户行为
   */
  public recordUserAction(action: UserAction): void {
    this.recordMetric({
      name: `user_action_${action.type}`,
      value: 1,
      timestamp: action.timestamp,
      type: 'counter',
      tags: {
        target: action.target || '',
        ...action.data
      }
    });
  }

  /**
   * 获取所有指标
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * 清空指标
   */
  public clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * 发送指标到服务器
   */
  public async sendMetrics(metrics?: PerformanceMetric[]): Promise<void> {
    if (!this.config.apiEndpoint) {
      this.log('No API endpoint configured');
      return;
    }

    const metricsToSend = metrics || this.metrics;
    if (metricsToSend.length === 0) {
      return;
    }

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appId: this.config.appId,
          metrics: metricsToSend,
          timestamp: now()
        })
      });

      if (response.ok) {
        this.log(`Sent ${metricsToSend.length} metrics`);
        if (!metrics) {
          this.clearMetrics();
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.log('Failed to send metrics:', error);
    }
  }

  /**
   * 获取资源类型
   */
  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['js', 'mjs'].includes(extension || '')) return 'script';
    if (['css'].includes(extension || '')) return 'stylesheet';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension || '')) return 'image';
    if (['woff', 'woff2', 'ttf', 'otf'].includes(extension || '')) return 'font';
    
    return 'other';
  }

  /**
   * 获取元素选择器
   */
  private getElementSelector(element: Element): string {
    if (!element) return '';
    
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `.${element.className.split(' ')[0]}`;
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * 日志输出
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[PerformanceMonitor]', ...args);
    }
  }
}