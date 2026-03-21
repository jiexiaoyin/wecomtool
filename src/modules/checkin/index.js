/**
 * 打卡考勤模块
 * API 章节：二十一
 */

const WeComSDK = require('../sdk');

class CheckIn extends WeComSDK {
  constructor(config) {
    super(config);
  }

  /**
   * 获取企业所有打卡规则
   */
  async getCorpRules() {
    return this.post('/checkin/getcorpcheckintypes', {});
  }

  /**
   * 获取员工打卡规则
   * @param {string} userId 成员 userid
   * @param {number} dateTime 查询日期时间戳
   */
  async getUserRules(userId, dateTime) {
    return this.post('/checkin/getcheckinrule', { userid: userId, datetime: dateTime });
  }

  /**
   * 获取打卡记录数据
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string[]} userIds 成员 userid 列表
   * @param {number} type 打卡类型: 1-上下班 2-外出 3-全部
   */
  async getRecords(startTime, endTime, userIds, type = 1) {
    return this.post('/checkin/getcheckindata', {
      starttime: startTime,
      endtime: endTime,
      userid: userIds,
      type
    });
  }

  /**
   * 获取打卡日报数据
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string[]} userIds 成员 userid 列表
   */
  async getDailyReport(startTime, endTime, userIds) {
    return this.post('/checkin/getcheckin_daydata', {
      starttime: startTime,
      endtime: endTime,
      userid: userIds
    });
  }

  /**
   * 获取打卡月报数据
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string[]} userIds 成员 userid 列表
   */
  async getMonthlyReport(startTime, endTime, userIds) {
    return this.post('/checkin/getcheckin_monthdata', {
      starttime: startTime,
      endtime: endTime,
      userid: userIds
    });
  }

  /**
   * 获取打卡人员排班信息
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string[]} userIds 成员 userid 列表
   */
  async getSchedule(startTime, endTime, userIds) {
    return this.post('/checkin/getcheckinschedulist', {
      starttime: startTime,
      endtime: endTime,
      userid: userIds
    });
  }

  /**
   * 为打卡人员排班
   * @param {string} userId 成员 userid
   * @param {number} scheduleTime 排班日期时间戳
   * @param {object} schedule 班次信息
   */
  async addSchedule(userId, scheduleTime, schedule) {
    return this.post('/checkin/addcheckinschedulist', {
      userid: userId,
      schedule_time: scheduleTime,
      schedule
    });
  }

  /**
   * 为打卡人员补卡
   * @param {string} userId 成员 userid
   * @param {number} checkinTime 补卡时间戳
   * @param {string} notes 备注
   */
  async addCheckinRecord(userId, checkinTime, notes = '') {
    return this.post('/checkin/addcheckinrecord', {
      userid: userId,
      checkin_time: checkinTime,
      notes
    });
  }

  /**
   * 获取设备打卡数据
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} deviceId 设备ID
   */
  async getDeviceData(startTime, endTime, deviceId) {
    return this.post('/checkin/get_device_checkin_data', {
      starttime: startTime,
      endtime: endTime,
      device_id: deviceId
    });
  }

  /**
   * 录入打卡人员人脸信息
   * @param {string} userId 成员 userid
   * @param {string} faceData 人脸数据 (base64)
   */
  async addFace(userId, faceData) {
    return this.post('/checkin/add_face', {
      userid: userId,
      face_data: faceData
    });
  }
}

module.exports = CheckIn;
