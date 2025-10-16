import { IEventObserverType, IPerformanceObserverType } from "../types";
import { perfObservers } from "./observeInstances";

export const createPerformanceObserver = (
  eventType: IPerformanceObserverType,
  cb: (performanceEntries: any[]) => void
): PerformanceObserver | null => {
  try {
    // 创建新的性能观察器实例
    const observer = new PerformanceObserver((entryList) => {
      // 当性能事件触发时，调用回调函数并传递性能条目
      cb(entryList.getEntries());
    });

    // 开始观察指定类型的性能事件
    observer.observe({ type: eventType, buffered: true });
    return observer;
  } catch (error) {
    console.error(`创建 ${eventType} 性能观察者时出错:`, error);
  }
  return null;
};

/**
 * 断开指定类型的性能观察者
 * @param type 性能观察者类型
 */
export const disconnectPerformanceObserver = (type: IEventObserverType) => {
  if (perfObservers[type]) {
    perfObservers[type].disconnect();
  }

  // 从观察器实例集合中删除该观察器，释放内存
  delete perfObservers[type];
};
