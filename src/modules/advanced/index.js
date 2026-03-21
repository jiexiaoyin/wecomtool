/**
 * 高级功能模块
 * API 章节：二十六 - 高级功能
 * 包含：成员申请回调、审批单设置、批量获取申请单
 */

const WeComSDK = require('../../sdk');

class Advanced extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 成员申请的提交回调 ==========

  /**
   * 获取成员申请列表
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {number} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getMemberApplicationList(startTime, endTime, cursor = 0, size = 100) {
    return this.post('/member_application/list', {
      start_time: startTime,
      end_time: endTime,
      cursor,
      limit: size
    });
  }

  /**
   * 获取成员申请详情
   * @param {string} applicationId 申请 ID
   */
  async getMemberApplicationDetail(applicationId) {
    return this.post('/member_application/get', { application_id: applicationId });
  }

  // ========== 审批单相关 ==========

  /**
   * 设置审批单审批信息
   * @param {string} spNo 审批单号
   * @param {object} params 审批信息
   */
  async setApprovalInfo(spNo, { approver, status, remark }) {
    return this.post('/approval/spinfo/set', {
      sp_no: spNo,
      approver,
      status,
      remark
    });
  }

  /**
   * 批量获取审批单 ID
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {number} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getApprovalIdList(startTime, endTime, cursor = 0, size = 100) {
    return this.post('/approval/spno/list', {
      start_time: startTime,
      end_time: endTime,
      cursor,
      limit: size
    });
  }

  /**
   * 获取审批单详细信息
   * @param {string} spNo 审批单号
   */
  async getApprovalDetail(spNo) {
    return this.post('/approval/spno/get', { sp_no: spNo });
  }

  // ========== 企业标签高级管理 ==========

  /**
   * 创建企业标签组
   * @param {string} groupName 组名称
   * @param {string[]} tags 标签列表
   */
  async createCorpTagGroup(groupName, tags = []) {
    return this.post('/corpgroup/tag/add', {
      group_name: groupName,
      tags
    });
  }

  /**
   * 获取企业标签组列表
   */
  async getCorpTagGroupList() {
    return this.post('/corpgroup/tag/list', {});
  }

  /**
   * 更新企业标签
   * @param {string} tagId 标签 ID
   * @param {string} tagName 新标签名
   */
  async updateCorpTag(tagId, tagName) {
    return this.post('/corpgroup/tag/update', {
      id: tagId,
      name: tagName
    });
  }

  /**
   * 删除企业标签
   * @param {string} tagId 标签 ID
   */
  async deleteCorpTag(tagId) {
    return this.post('/corpgroup/tag/del', { tag_id: tagId });
  }

  // ========== 企业群聊管理 ==========

  /**
   * 获取企业群聊列表
   * @param {string} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getCorpGroupChatList(cursor = '', size = 100) {
    return this.post('/corpgroup/chat/list', { cursor, limit: size });
  }

  /**
   * 获取企业群聊详情
   * @param {string} chatId 群聊 ID
   */
  async getCorpGroupChatDetail(chatId) {
    return this.post('/corpgroup/chat/get', { chat_id: chatId });
  }

  // ========== 互联企业消息推送 ==========

  /**
   * 给互联企业发送消息
   * @param {string} corpId 目标企业 ID
   * @param {string} toUser 接收成员
   * @param {object} content 消息内容
   * @param {string} msgType 消息类型
   */
  async sendToLinkedCorp(corpId, toUser, content, msgType = 'text') {
    return this.post('/corpgroup/message/send', {
      corp_id: corpId,
      touser: toUser,
      msgtype: msgType,
      [msgType]: content
    });
  }
}

module.exports = Advanced;
