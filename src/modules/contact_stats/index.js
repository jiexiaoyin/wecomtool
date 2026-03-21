/**
 * 客户统计模块
 * API 章节：十三 - 统计管理
 * 包含：联系客户统计、群聊数据统计
 */

const WeComSDK = require('../sdk');

class ContactStats extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 联系客户统计 ==========

  /**
   * 获取「联系客户统计」数据
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} userId 成员 ID（可选）
   * @param {string} departmentId 部门 ID（可选）
   */
  async getUserClientStat(startTime, endTime, userId = '', departmentId = '') {
    return this.post('/externalcontact/get_user_client_data', {
      start_time: startTime,
      end_time: endTime,
      userid: userId,
      department_id: departmentId
    });
  }

  /**
   * 获取成员联系客户统计明细
   * @param {string} userId 成员 ID
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   */
  async getUserClientDetail(userId, startTime, endTime) {
    return this.post('/externalcontact/get_user_client_detail', {
      userid: userId,
      start_time: startTime,
      end_time: endTime
    });
  }

  // ========== 群聊数据统计 ==========

  /**
   * 获取「群聊数据统计」数据
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} userId 成员 ID（可选）
   * @param {string} departmentId 部门 ID（可选）
   */
  async getGroupChatStat(startTime, endTime, userId = '', departmentId = '') {
    return this.post('/externalcontact/get_group_chat_data', {
      start_time: startTime,
      end_time: endTime,
      userid: userId,
      department_id: departmentId
    });
  }

  /**
   * 获取群聊统计数据详情
   * @param {string} chatId 群聊 ID
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   */
  async getGroupChatDetail(chatId, startTime, endTime) {
    return this.post('/externalcontact/get_group_chat_detail', {
      chat_id: chatId,
      start_time: startTime,
      end_time: endTime
    });
  }

  // ========== 客户流失统计 ==========

  /**
   * 获取客户流失统计数据
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} userId 成员 ID（可选）
   */
  async getUserLostStat(startTime, endTime, userId = '') {
    return this.post('/externalcontact/get_user_lost_data', {
      start_time: startTime,
      end_time: endTime,
      userid: userId
    });
  }

  // ========== 客户群统计 ==========

  /**
   * 获取客户群成员统计
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} groupChatId 群聊 ID
   */
  async getGroupChatMemberStat(groupChatId, startTime, endTime) {
    return this.post('/externalcontact/get_group_chat_member_stat', {
      chat_id: groupChatId,
      start_time: startTime,
      end_time: endTime
    });
  }

  // ========== 客户互动统计 ==========

  /**
   * 获取客户互动统计数据
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} userId 成员 ID
   */
  async getUserInteractionStat(userId, startTime, endTime) {
    return this.post('/externalcontact/get_user_interaction_stat', {
      userid: userId,
      start_time: startTime,
      end_time: endTime
    });
  }
}

module.exports = ContactStats;
