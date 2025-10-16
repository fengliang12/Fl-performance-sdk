/**
 * 存储空间估算报告函数
 *
 * 该函数使用 StorageManager 接口的 estimate() 方法来获取应用的存储使用情况：
 * - 应用已使用的存储空间（usage）
 * - 可用的存储空间（quota）
 * - 各种存储类型的详细使用情况
 *
 * 参考文档：https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate
 *
 * @param storageInfo - StorageEstimate 对象，包含存储空间的使用和配额信息
 */
export declare const reportStorageEstimate: (storageInfo: StorageEstimate) => void;
//# sourceMappingURL=storageEstimate.d.ts.map