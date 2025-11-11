// 性能监控SDK示例
import PerformanceSdk from "../../dist/index.module.js";

console.log("Performance SDK Example Starting...");

const sdk = new PerformanceSdk({
  elementTiming: true, // 开启元素性能监控
  resourceTiming: true, // 开启资源性能监控
  logUrl: "http://123.com/test",
  captureError: true, // 开启错误监控
});

console.log("🐻 Performance SDK initialized:", sdk);

// 模拟一个长任务来测试性能监控
console.log("Starting long task simulation...");
const start = Date.now();
while (Date.now() - start < 1000) {
  // 模拟1秒的长任务
}
