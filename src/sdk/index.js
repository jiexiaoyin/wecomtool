/**
 * 企业微信 SDK 统一封装
 * 基于官方 API: https://developer.work.weixin.qq.com
 * 
 * 统一特性：
 * - Token 自动获取与缓存
 * - 统一错误处理
 * - 文件上传支持
 * - 分页查询支持
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class WeComSDK {
  constructor(config) {
    this.corpId = config.corpId;
    this.corpSecret = config.corpSecret;
    this.agentId = config.agentId;
    this.tokenCache = null;
    this.tokenExpireTime = 0;
    this.baseUrl = 'https://qyapi.weixin.qq.com/cgi-bin';
  }

  // ==================== Token 管理 ====================

  /**
   * 获取 access_token
   */
  async getAccessToken() {
    const now = Date.now();
    if (this.tokenCache && now < this.tokenExpireTime) {
      return this.tokenCache;
    }

    const url = `${this.baseUrl}/gettoken`;
    const { data } = await axios.get(url, {
      params: { corpid: this.corpId, corpsecret: this.corpSecret }
    });

    if (data.errcode !== 0) {
      throw new Error(`获取 token 失败: ${data.errmsg}`);
    }

    this.tokenCache = data.access_token;
    // 提前5分钟过期
    this.tokenExpireTime = now + (data.expires_in - 300) * 1000;
    return this.tokenCache;
  }

  /**
   * 清除 token 缓存
   */
  clearTokenCache() {
    this.tokenCache = null;
    this.tokenExpireTime = 0;
  }

  // ==================== 通用请求 ====================

  /**
   * 通用请求方法
   * @param {string} method 请求方法
   * @param {string} url 请求路径
   * @param {object} data 请求数据
   * @param {object} options 额外选项
   */
  async request(method, url, data = {}, options = {}) {
    const token = await this.getAccessToken();
    const fullUrl = `${this.baseUrl}${url}?access_token=${token}`;

    const config = { method, url: fullUrl };

    if (method === 'GET') {
      config.params = { ...data, ...options };
    } else {
      config.data = data;
    }

    // 文件上传处理
    if (options.apiType === 'upload') {
      config.headers = { 'Content-Type': 'multipart/form-data' };
      config.data = this.buildFormData(data);
    }

    // 响应类型处理
    if (options.responseType) {
      config.responseType = options.responseType;
    }

    const response = await axios(config);
    const result = response.data;

    // 统一错误处理
    if (result.errcode && result.errcode !== 0) {
      throw new Error(`API 错误 [${result.errcode}]: ${result.errmsg}`);
    }

    return result;
  }

  /**
   * GET 请求
   */
  async get(url, params = {}) {
    return this.request('GET', url, params);
  }

  /**
   * POST 请求
   */
  async post(url, data = {}, options = {}) {
    return this.request('POST', url, data, options);
  }

  // ==================== 文件处理 ====================

  /**
   * 构建表单数据（文件上传）
   */
  buildFormData(data) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return formData;
  }

  /**
   * 上传文件
   * @param {string} filePath 文件路径
   * @param {string} fieldName 字段名
   * @param {object} additionalData 额外数据
   */
  async uploadFile(filePath, fieldName = 'media', additionalData = {}) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }

    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    const formData = {
      [fieldName]: {
        value: fileBuffer,
        options: {
          filename: fileName,
          contentType: this.getContentType(fileName)
        }
      },
      ...additionalData
    };

    return this.post('/media/upload', formData, { apiType: 'upload' });
  }

  /**
   * 下载文件
   * @param {string} mediaId 媒体 ID
   * @param {string} savePath 保存路径
   */
  async downloadFile(mediaId, savePath) {
    const response = await this.request('GET', '/media/get', { media_id: mediaId }, { responseType: 'stream' });

    if (savePath) {
      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve({ savePath }));
        writer.on('error', reject);
      });
    }

    return response.data;
  }

  /**
   * 根据文件扩展名获取 Content-Type
   */
  getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const types = {
      '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
      '.gif': 'image/gif', '.bmp': 'image/bmp', '.webp': 'image/webp',
      '.mp3': 'audio/mpeg', '.wav': 'audio/x-wav', '.amr': 'audio/amr',
      '.mp4': 'video/mp4', '.avi': 'video/x-msvideo',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.zip': 'application/zip'
    };
    return types[ext] || 'application/octet-stream';
  }

  // ==================== 分页查询 ====================

  /**
   * 分页查询通用方法
   * @param {Function} fetchFn 获取单页数据的函数
   * @param {string} listKey 返回列表的字段名
   * @param {number} pageSize 每页数量
   * @returns {Promise<Array>} 所有数据
   */
  async paginate(fetchFn, listKey = 'list', pageSize = 100) {
    let cursor = '';
    const results = [];

    do {
      const pageData = await fetchFn(cursor, pageSize);
      const list = pageData[listKey] || [];
      results.push(...list);
      cursor = pageData.next_cursor || '';
    } while (cursor);

    return results;
  }

  // ==================== 工具方法 ====================

  /**
   * 时间戳转日期
   */
  timestampToDate(timestamp) {
    return new Date(timestamp * 1000);
  }

  /**
   * 日期转时间戳
   */
  dateToTimestamp(date) {
    return Math.floor(new Date(date).getTime() / 1000);
  }

  /**
   * 格式化用户列表（用 | 分隔）
   */
  formatUserList(userIds) {
    return Array.isArray(userIds) ? userIds.join('|') : userIds;
  }

  /**
   * 格式化部门列表
   */
  formatDepartmentList(departmentIds) {
    return Array.isArray(departmentIds) ? departmentIds.join('|') : departmentIds;
  }

  // ==================== 企业信息 ====================

  /**
   * 获取企业微信接口 IP 段
   * 用于设置企业可信IP
   */
  async getApiIpList() {
    return this.get('/cgi-bin/get_api_ip_json', {});
  }

  /**
   * 获取企业微信回调 IP 段
   * 用于验证回调请求来源
   */
  async getCallbackIpList() {
    return this.get('/cgi-bin/getcallback_ip_json', {});
  }
}

module.exports = WeComSDK;
