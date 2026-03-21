/**
 * 审批管理模块
 * API 章节：二十二
 */

const WeComSDK = require('../../sdk');

class Approval extends WeComSDK {
  constructor(config) {
    super(config);
  }

  /**
   * 获取审批模板详情
   * @param {string} templateId 模板 ID
   */
  async getTemplateDetail(templateId) {
    return this.post('/approval/get_template_detail', { template_id: templateId });
  }

  /**
   * 提交审批申请
   * @param {object} params 审批参数
   */
  async submitApproval(params) {
    const { templateId, creator, useTemplate_approver, approver, content } = params;
    return this.post('/approval/start', {
      template_id: templateId,
      creator,
      use_template_approver: useTemplate_approver || 0,
      approver,
      content
    });
  }

  /**
   * 批量获取审批单号
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {number} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getApprovalIds(startTime, endTime, cursor = 0, size = 100) {
    return this.post('/approval/list', {
      starttime: startTime,
      endtime: endTime,
      cursor,
      size
    });
  }

  /**
   * 获取审批申请详情
   * @param {string} spNo 审批单号
   */
  async getApprovalDetail(spNo) {
    return this.post('/approval/get', { sp_no: spNo });
  }

  /**
   * 获取企业假期管理配置
   */
  async getLeaveConfig() {
    return this.post('/approval/getcorpconf', {});
  }

  /**
   * 获取成员假期余额
   * @param {string} userId 成员 userid
   */
  async getLeaveBalance(userId) {
    return this.post('/approval/get_balances', { userid: userId });
  }

  /**
   * 修改成员假期余额
   * @param {string} userId 成员 userid
   * @param {string} leaveType 假期类型
   * @param {number} balance 假期时长（天数）
   */
  async updateLeaveBalance(userId, leaveType, balance) {
    return this.post('/approval/set_balances', {
      userid: userId,
      leave_type: leaveType,
      balance
    });
  }

  /**
   * 创建审批模板
   * @param {object} params 模板参数
   */
  async createTemplate(params) {
    return this.post('/approval/template/create', params);
  }

  /**
   * 更新审批模板
   * @param {string} templateId 模板 ID
   * @param {object} params 更新参数
   */
  async updateTemplate(templateId, params) {
    return this.post('/approval/template/update', {
      template_id: templateId,
      ...params
    });
  }

  /**
   * 获取审批流程引擎配置
   * @param {string} templateId 模板 ID
   */
  async getApprovalProcess(templateId) {
    return this.post('/approval/get_process', { template_id: templateId });
  }

  /**
   * 设置审批流程
   * @param {string} templateId 模板 ID
   * @param {object} process 流程配置
   */
  async setApprovalProcess(templateId, process) {
    return this.post('/approval/set_process', {
      template_id: templateId,
      process
    });
  }

  /**
   * 审批单回调通知（通过回调模块处理，此处仅提供查询）
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getApprovalCallbackList(startTime, endTime, cursor = '', size = 100) {
    return this.post('/approval/callback_list', {
      starttime: startTime,
      endtime: endTime,
      cursor,
      limit: size
    });
  }
}

module.exports = Approval;
