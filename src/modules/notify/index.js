/**
 * 紧急通知模块
 * API 章节：二十七 - 紧急通知应用
 * 包含：发起语音电话、获取接听状态
 */

const WeComSDK = require('../../sdk');

class Notify extends WeComSDK {
  constructor(config) {
    super(config);
  }

  /**
   * 发起语音电话
   * @param {string} userId 成员 ID
   * @param {string[]} toUsers 被通知成员列表
   * @param {string} prompt 提示音类型: greeting-欢迎提示音, notice-到期提醒
   */
  async sendVoiceCall(userId, toUsers, prompt = 'notice') {
    return this.post('/ instantservice/voicenotify', {
      userid: userId,
      to_user: toUsers,
      prompt
    });
  }

  /**
   * 批量发起语音电话
   * @param {string} userId 成员 ID
   * @param {string[]} toUsers 被通知成员列表
   * @param {string} prompt 提示音类型
   */
  async batchSendVoiceCall(userId, toUsers, prompt = 'notice') {
    return this.sendVoiceCall(userId, toUsers, prompt);
  }

  /**
   * 获取语音通知状态
   * @param {string} notifyId 通知 ID
   */
  async getVoiceNotifyStatus(notifyId) {
    return this.post('/ instantservice/voiceNotify/status', { notify_id: notifyId });
  }

  // ========== 企业提醒通知 ==========

  /**
   * 发送企业提醒
   * @param {string} userId 成员 ID
   * @param {string} content 提醒内容
   * @param {string[]} toUsers 通知成员列表
   */
  async sendCorpReminder(userId, content, toUsers) {
    return this.post('/ instantservice/corp_reminder', {
      userid: userId,
      content,
      to_users: toUsers
    });
  }

  // ========== 工作通知提醒 ==========

  /**
   * 发送工作通知提醒
   * @param {string} userId 成员 ID
   * @param {string} content 提醒内容
   * @param {string[]} toUsers 通知成员列表
   * @param {number} agentId 应用 ID
   */
  async sendWorkNoticeReminder(userId, content, toUsers, agentId) {
    return this.post('/ instantservice/worknotice_reminder', {
      userid: userId,
      content,
      to_users: toUsers,
      agentid: agentId
    });
  }
}

module.exports = Notify;
