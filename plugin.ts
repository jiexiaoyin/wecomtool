/**
 * OpenClaw 插件入口 - 企业微信工具
 * 
 * 继承 OpenClaw HTTP 服务，提供回调处理和 API 能力
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

// 动态导入 CommonJS 模块（避免 ESM/CJS 混用问题）
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 导入配置加载器
const { getConfig } = require('./config.js');

// 导入回调处理模块
const Callback = require('./src/modules/callback/index.js');

// 插件配置
interface PluginConfig {
  corpId?: string;
  corpSecret?: string;
  agentId?: string;
  token?: string;
  encodingAESKey?: string;
}

let callbackInstance: any = null;

const plugin = {
  id: "wecom-api",
  name: "WeCom Tool (企业微信工具)",
  description: "企业微信 API 工具集，支持回调处理和 32 个 API 模块",
  configSchema: {
    type: "object",
    properties: {
      corpId: { type: "string" },
      corpSecret: { type: "string" },
      agentId: { type: "string" },
      token: { type: "string" },
      encodingAESKey: { type: "string" },
    },
  },

  /**
   * 注册插件
   */
  register(api: OpenClawPluginApi) {
    console.log('[wecom-api] 插件注册中...');

    // 加载配置
    const config = getConfig();
    
    // 初始化回调处理实例
    if (config.corpId && config.corpSecret && config.agentId) {
      callbackInstance = new Callback.default ? new Callback.default(config) : new Callback(config);
      console.log('[wecom-api] 回调处理已初始化');
    }

    // 注册 HTTP 路由 - 回调入口
    api.registerHttpRoute({
      path: "/plugins/wecom-api/callback",
      handler: handleCallbackRequest,
      auth: "none", // 企业微信需要验证签名，不在网关层验证
      match: "prefix",
    });

    // 兼容旧路径
    api.registerHttpRoute({
      path: "/wecom-api/callback",
      handler: handleCallbackRequest,
      auth: "none",
      match: "prefix",
    });

    console.log('[wecom-api] 插件注册完成');
  },
};

/**
 * 处理企业微信回调请求
 */
async function handleCallbackRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  if (!callbackInstance) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('wecom-api plugin not initialized');
    return true;
  }

  const url = req.url || '';
  const query = new URLSearchParams(url.split('?')[1] || '');
  
  const params = {
    msgSignature: query.get('msg_signature') || query.get('signature') || '',
    timestamp: query.get('timestamp') || '',
    nonce: query.get('nonce') || '',
    echostr: query.get('echostr') || '',
  };

  // 读取 body
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString();

  try {
    // 调用回调处理
    const result = await callbackInstance.handle({
      ...params,
      xmlBody: body,
    });

    if (result.type === 'success') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(result.body);
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(result.message || 'error');
    }
  } catch (error: any) {
    console.error('[wecom-api] 回调处理失败:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('error');
  }

  return true;
}

export default plugin;
