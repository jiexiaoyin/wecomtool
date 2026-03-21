/**
 * 身份验证模块
 * API 章节：四 - 身份验证
 * 包含：网页授权登录、企业微信 Web 登录、二次验证
 */

const WeComSDK = require('../sdk');

class Auth extends WeComSDK {
  constructor(config) {
    super(config);
    this.redirectUri = config.redirectUri || '';
  }

  // ========== 网页授权登录 ==========

  /**
   * 构造网页授权链接
   * @param {string} redirectUri 授权回调地址
   * @param {string} state 自定义状态
   * @param {string} scope 授权作用域: snsapi_base 或 snsapi_userinfo
   */
  getWebAuthUrl(redirectUri, state = '', scope = 'snsapi_userinfo') {
    const encodedUri = encodeURIComponent(redirectUri);
    return `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${this.corpId}&agentid=${this.agentId}&redirect_uri=${encodedUri}&state=${state}&scope=${scope}`;
  }

  /**
   * 获取访问用户身份（用户同意授权后获取）
   * @param {string} code 授权 code
   */
  async getUserInfo(code) {
    return this.get('/user/getuserinfo', { code });
  }

  /**
   * 获取访问用户敏感信息
   * @param {string} code 授权 code
   */
  async getUserDetail(code) {
    return this.post('/user/getuserdetail', { code });
  }

  // ========== 企业微信 Web 登录 ==========

  /**
   * 获取用户登录身份（Web 登录）
   * @param {string} code 登录 code
   */
  async getWebLoginUserInfo(code) {
    return this.post('/user/get_login_info', { code });
  }

  // ========== 二次验证 ==========

  /**
   * 获取用户二次验证信息
   * @param {string} userId 用户 ID
   */
  async getSecondVerifyInfo(userId) {
    return this.post('/user/get_second_verification_info', { userid: userId });
  }

  /**
   * 登录二次验证
   * @param {string} userId 用户 ID
   * @param {string} verificationCode 验证码
   */
  async secondVerify(userId, verificationCode) {
    return this.post('/user/second_verification', {
      userid: userId,
      verification_code: verificationCode
    });
  }

  /**
   * 使用二次验证
   * @param {string} userId 用户 ID
   */
  async applySecondVerify(userId) {
    return this.post('/user/apply_second_verification', { userid: userId });
  }

  // ========== 登录辅助方法 ==========

  /**
   * 通过 code 获取用户 ID
   * @param {string} code 授权 code
   */
  async getUserIdByCode(code) {
    try {
      const result = await this.getUserInfo(code);
      if (result.ErrCode === 0) {
        return result.UserId;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

module.exports = Auth;
