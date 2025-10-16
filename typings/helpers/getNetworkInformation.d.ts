import { EffectiveConnectionType, INetworkInformation } from "../types";
/**
 * 网络连接类型
 * 用于存储当前网络的有效连接类型，默认为 '4g'
 */
export declare let et: EffectiveConnectionType;
/**
 * 节省数据模式状态
 * 表示用户是否启用了节省数据模式，默认为 false
 */
export declare let sd: boolean;
/**
 * 获取网络连接信息
 * 从浏览器的 Network Information API 获取网络状态信息
 * 包括下行带宽、有效连接类型、往返时间等
 *
 * 如果浏览器不支持 Network Information API，则返回空对象
 * 未来计划实现多普勒测速法或图片探测法作为备选方案
 *
 * @returns 网络信息对象，包含下行带宽、连接类型、RTT等信息
 */
export declare const getNetworkInformation: () => INetworkInformation;
//# sourceMappingURL=getNetworkInformation.d.ts.map