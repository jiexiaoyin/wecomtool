/**
 * 打卡规则管理模块
 * API 章节：二十一 - 打卡（规则管理）
 * 包含：管理打卡规则、设备打卡数据
 */

const WeComSDK = require('../../sdk');

class CheckInRules extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 打卡规则管理 ==========

  /**
   * 获取企业所有打卡规则
   * @param {number} offset 偏移量
   * @param {number} size 每页数量
   */
  async getCheckInRules(offset = 0, size = 100) {
    return this.post('/checkin/get_rule', { offset, limit: size });
  }

  /**
   * 获取打卡规则详情
   * @param {string} groupId 打卡组 ID
   */
  async getCheckInRuleDetail(groupId) {
    return this.post('/checkin/get_rule_detail', { group_id: groupId });
  }

  /**
   * 创建打卡规则
   * @param {object} rule 打卡规则配置
   */
  async createCheckInRule(rule) {
    return this.post('/checkin/add_rule', rule);
  }

  /**
   * 更新打卡规则
   * @param {string} groupId 打卡组 ID
   * @param {object} rule 打卡规则配置
   */
  async updateCheckInRule(groupId, rule) {
    return this.post('/checkin/update_rule', {
      group_id: groupId,
      ...rule
    });
  }

  /**
   * 删除打卡规则
   * @param {string} groupId 打卡组 ID
   */
  async deleteCheckInRule(groupId) {
    return this.post('/checkin/del_rule', { group_id: groupId });
  }

  /**
   * 拷贝打卡规则
   * @param {string} sourceGroupId 源打卡组 ID
   * @param {string} newGroupName 新打卡组名称
   */
  async copyCheckInRule(sourceGroupId, newGroupName) {
    return this.post('/checkin/copy_rule', {
      source_group_id: sourceGroupId,
      new_group_name: newGroupName
    });
  }

  // ========== 打卡人员管理 ==========

  /**
   * 获取打卡规则成员
   * @param {string} groupId 打卡组 ID
   */
  async getCheckInRuleUsers(groupId) {
    return this.post('/checkin/get_rule_user', { group_id: groupId });
  }

  /**
   * 添加入打卡规则成员
   * @param {string} groupId 打卡组 ID
   * @param {string[]} userIds 成员 ID 列表
   * @param {number[]} departmentIds 部门 ID 列表
   */
  async addCheckInRuleUsers(groupId, userIds = [], departmentIds = []) {
    return this.post('/checkin/add_rule_user', {
      group_id: groupId,
      users: userIds,
      departments: departmentIds
    });
  }

  /**
   * 删除打卡规则成员
   * @param {string} groupId 打卡组 ID
   * @param {string[]} userIds 成员 ID 列表
   * @param {number[]} departmentIds 部门 ID 列表
   */
  async removeCheckInRuleUsers(groupId, userIds = [], departmentIds = []) {
    return this.post('/checkin/del_rule_user', {
      group_id: groupId,
      users: userIds,
      departments: departmentIds
    });
  }

  // ========== 打卡地点管理 ==========

  /**
   * 获取打卡地点列表
   * @param {string} groupId 打卡组 ID
   */
  async getCheckInLocations(groupId) {
    return this.post('/checkin/get_location_list', { group_id: groupId });
  }

  /**
   * 添加打卡地点
   * @param {string} groupId 打卡组 ID
   * @param {object} location 地点配置
   */
  async addCheckInLocation(groupId, location) {
    return this.post('/checkin/add_location', {
      group_id: groupId,
      ...location
    });
  }

  /**
   * 删除打卡地点
   * @param {string} groupId 打卡组 ID
   * @param {string} locationId 地点 ID
   */
  async deleteCheckInLocation(groupId, locationId) {
    return this.post('/checkin/del_location', {
      group_id: groupId,
      location_id: locationId
    });
  }

  // ========== 设备打卡数据 ==========

  /**
   * 获取设备打卡数据
   * @param {string} deviceId 设备 ID
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   */
  async getDeviceCheckInData(deviceId, startTime, endTime) {
    return this.post('/checkin/get_device_data', {
      device_id: deviceId,
      start_time: startTime,
      end_time: endTime
    });
  }

  /**
   * 获取设备列表
   * @param {number} offset 偏移量
   * @param {number} size 每页数量
   */
  async getDeviceList(offset = 0, size = 100) {
    return this.post('/checkin/get_device_list', { offset, limit: size });
  }

  // ========== 打卡提醒设置 ==========

  /**
   * 设置打卡提醒
   * @param {string} groupId 打卡组 ID
   * @param {number} remindTime 提醒时间（秒）
   * @param {string} remindLocation 提醒地点
   */
  async setCheckInReminder(groupId, remindTime, remidLocation = '') {
    return this.post('/checkin/set_remind', {
      group_id: groupId,
      remind_time: remindTime,
      remind_location: remidLocation
    });
  }

  // ========== 排班管理 ==========

  /**
   * 获取打卡人员排班信息
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} userId 成员 ID（可选）
   * @param {number} departmentId 部门 ID（可选）
   */
  async getCheckInSchedule(startTime, endTime, userId = '', departmentId = '') {
    return this.post('/checkin/get_schedulelist', {
      starttime: startTime,
      endtime: endTime,
      userid: userId,
      department_id: departmentId
    });
  }

  /**
   * 为打卡人员排班
   * @param {string} userId 成员 ID
   * @param {number} scheduleDate 排班日期时间戳
   * @param {string} dayType 日期类型: workdays-工作日, holidays-节假日
   * @param {string} timeSection 时段配置
   */
  async setCheckInSchedule(userId, scheduleDate, dayType = 'workdays', timeSection = '') {
    return this.post('/checkin/add_schedulelist', {
      userid: userId,
      schedule_date: scheduleDate,
      day_type: dayType,
      time_section: timeSection
    });
  }

  /**
   * 清除打卡人员排班
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string[]} userIds 成员 ID 列表
   */
  async clearCheckInSchedule(startTime, endTime, userIds) {
    return this.post('/checkin/del_schedulelist', {
      starttime: startTime,
      endtime: endTime,
      useridlist: userIds
    });
  }

  // ========== 补卡管理 ==========

  /**
   * 为打卡人员补卡
   * @param {string} userId 成员 ID
   * @param {number} time 补卡时间戳
   * @param {string} notes 备注
   */
  async addCheckInRecord(userId, time, notes = '') {
    return this.post('/checkin/add_checkin_record', {
      userid: userId,
      time,
      notes
    });
  }
}

module.exports = CheckInRules;
