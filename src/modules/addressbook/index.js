/**
 * 通讯录管理模块
 * API 章节：三 - 通讯录管理
 * 包含：成员管理、部门管理、标签管理、异步导入导出
 */

const WeComSDK = require('../../sdk');

class AddressBook extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 成员管理 ==========

  /**
   * 创建成员
   * @param {object} params 成员参数
   */
  async createUser(params) {
    const { userId, name, mobile, email, departments, position, gender, avatar, enable } = params;
    return this.post('/user/create', {
      userid: userId,
      name,
      mobile,
      email,
      department: departments,
      position,
      gender: gender || 0,
      avatar,
      enable: enable !== undefined ? enable : 1
    });
  }

  /**
   * 读取成员
   * @param {string} userId 成员 userid
   */
  async getUser(userId) {
    return this.post('/user/get', { userid: userId });
  }

  /**
   * 更新成员
   * @param {object} params 成员参数
   */
  async updateUser(params) {
    const { userId, name, mobile, email, departments, position, gender, avatar, enable } = params;
    return this.post('/user/update', {
      userid: userId,
      name,
      mobile,
      email,
      department: departments,
      position,
      gender,
      avatar,
      enable
    });
  }

  /**
   * 删除成员
   * @param {string} userId 成员 userid
   */
  async deleteUser(userId) {
    return this.post('/user/delete', { userid: userId });
  }

  /**
   * 批量删除成员
   * @param {string[]} userIds 成员 userid 列表
   */
  async batchDeleteUsers(userIds) {
    return this.post('/user/batchdelete', { useridlist: userIds });
  }

  /**
   * 获取部门成员
   * @param {number} departmentId 部门 id
   * @param {boolean} fetchChild 是否递归获取子部门成员
   */
  async getDepartmentUsers(departmentId, fetchChild = false) {
    return this.get('/user/simplelist', {
      department_id: departmentId,
      fetch_child: fetchChild ? 1 : 0
    });
  }

  /**
   * 获取部门成员详情
   * @param {number} departmentId 部门 id
   * @param {boolean} fetchChild 是否递归获取子部门成员
   */
  async getDepartmentUsersDetail(departmentId, fetchChild = false) {
    return this.get('/user/list', {
      department_id: departmentId,
      fetch_child: fetchChild ? 1 : 0
    });
  }

  /**
   * userid 与 openid 互换
   * @param {string} openId openid
   * @param {string} userId userid
   */
  async convertToUserId(openId, userId) {
    return this.post('/user/convert_to_userid', { openid: openId, userid: userId });
  }

  /**
   * 手机号获取 userid
   * @param {string} mobile 手机号
   */
  async getUserIdByMobile(mobile) {
    return this.post('/user/getuserid3', { mobile });
  }

  /**
   * 邮箱获取 userid
   * @param {string} email 邮箱
   */
  async getUserIdByEmail(email) {
    return this.post('/user/getuserid4', { email });
  }

  /**
   * 邀请成员
   * @param {string} userId 成员 userid
   */
  async inviteUser(userId) {
    return this.post('/invite/user', { userid: userId });
  }

  /**
   * 获取加入企业二维码
   * @param {number} sizeType 二维码尺寸类型
   */
  async getJoinQrCode(sizeType = 1) {
    return this.post('/invite/get_qrcode', { size_type: sizeType });
  }

  /**
   * 获取成员 ID 列表
   * @param {number} departmentId 部门 id
   */
  async getUserIdList(departmentId) {
    return this.get('/user/list_id', { department_id: departmentId });
  }

  // ========== 用户ID转换 ==========

  /**
   * tmp_external_userid 的转换
   * 将外部联系人临时 ID 转换为永久 external_userid
   * @param {string} tmpExternalUserId 外部联系人临时 ID
   */
  async convertTmpExternalUserId(tmpExternalUserId) {
    return this.post('/externalcontact/convert_to_external_userid', {
      tmp_external_userid: tmpExternalUserId
    });
  }

  // ========== 成员扩展属性 ==========

  /**
   * 获取成员扩展属性
   * @param {string} userId 成员 userid
   */
  async getUserExtAttr(userId) {
    return this.post('/user/get', { userid: userId });
  }

  /**
   * 设置成员扩展属性
   * @param {string} userId 成员 userid
   * @param {object[]} extAttr 扩展属性列表
   */
  async setUserExtAttr(userId, extAttr) {
    return this.post('/user/update', {
      userid: userId,
      extattr: extAttr
    });
  }

  // ========== 部门管理 ==========

  /**
   * 创建部门
   * @param {string} name 部门名称
   * @param {number} parentId 父部门 id
   * @param {number} order 排序
   */
  async createDepartment(name, parentId = 1, order = 0) {
    return this.post('/department/create', {
      name,
      parentid: parentId,
      order
    });
  }

  /**
   * 更新部门
   * @param {number} departmentId 部门 id
   * @param {object} params 更新参数
   */
  async updateDepartment(departmentId, { name, parentId, order }) {
    return this.post('/department/update', {
      id: departmentId,
      name,
      parentid: parentId,
      order
    });
  }

  /**
   * 删除部门
   * @param {number} departmentId 部门 id
   */
  async deleteDepartment(departmentId) {
    return this.post('/department/delete', { id: departmentId });
  }

  /**
   * 获取部门列表
   * @param {number} departmentId 部门 id，不填则获取全部
   */
  async getDepartmentList(departmentId) {
    return this.post('/department/list', { id: departmentId });
  }

  /**
   * 获取子部门 ID 列表
   * @param {number} departmentId 部门 id
   */
  async getSubDepartmentIds(departmentId) {
    return this.post('/department/list_id', { id: departmentId });
  }

  /**
   * 获取单个部门详情
   * @param {number} departmentId 部门 id
   */
  async getDepartmentDetail(departmentId) {
    return this.get('/department/get', { id: departmentId });
  }

  // ========== 标签管理 ==========

  /**
   * 创建标签
   * @param {string} tagName 标签名称
   * @param {number} tagId 标签 id（可选）
   */
  async createTag(tagName, tagId) {
    return this.post('/tag/create', {
      tagname: tagName,
      tagid: tagId
    });
  }

  /**
   * 更新标签名字
   * @param {number} tagId 标签 id
   * @param {string} tagName 新标签名
   */
  async updateTag(tagId, tagName) {
    return this.post('/tag/update', {
      tagid: tagId,
      tagname: tagName
    });
  }

  /**
   * 删除标签
   * @param {number} tagId 标签 id
   */
  async deleteTag(tagId) {
    return this.post('/tag/delete', { tagid: tagId });
  }

  /**
   * 获取标签成员
   * @param {number} tagId 标签 id
   */
  async getTagUsers(tagId) {
    return this.post('/tag/get', { tagid: tagId });
  }

  /**
   * 增加标签成员
   * @param {number} tagId 标签 id
   * @param {string[]} userIds 成员 userid 列表
   * @param {number[]} departmentIds 部门 id 列表
   */
  async addTagUsers(tagId, userIds = [], departmentIds = []) {
    return this.post('/tag/addtagusers', {
      tagid: tagId,
      userlist: userIds,
      partylist: departmentIds
    });
  }

  /**
   * 删除标签成员
   * @param {number} tagId 标签 id
   * @param {string[]} userIds 成员 userid 列表
   * @param {number[]} departmentIds 部门 id 列表
   */
  async removeTagUsers(tagId, userIds = [], departmentIds = []) {
    return this.post('/tag/deltagusers', {
      tagid: tagId,
      userlist: userIds,
      partylist: departmentIds
    });
  }

  /**
   * 获取标签列表
   */
  async getTagList() {
    return this.post('/tag/list', {});
  }

  // ========== 异步导入 ==========

  /**
   * 增量更新成员
   * @param {string} mediaId 文件 id
   * @param {boolean} toInvite 是否邀请
   */
  async syncUsers(mediaId, toInvite = true) {
    return this.post('/user/syncuser', {
      media_id: mediaId,
      to_invite: toInvite ? 1 : 0
    });
  }

  /**
   * 全量覆盖成员
   * @param {string} mediaId 文件 id
   * @param {boolean} toInvite 是否邀请
   */
  async replaceUsers(mediaId, toInvite = true) {
    return this.post('/user/replaceuser', {
      media_id: mediaId,
      to_invite: toInvite ? 1 : 0
    });
  }

  /**
   * 全量覆盖部门
   * @param {string} mediaId 文件 id
   */
  async replaceDepartments(mediaId) {
    return this.post('/department/replaceparty', { media_id: mediaId });
  }

  /**
   * 获取异步任务结果
   * @param {string} jobId 任务 id
   */
  async getAsyncJobResult(jobId) {
    return this.post('/getresult', { jobid: jobId });
  }

  // ========== 异步导出 ==========

  /**
   * 导出成员
   * @param {number} departmentId 部门 id
   * @param {number} departmentIds 部门 id 列表
   */
  async exportUsers(departmentId = 1, departmentIds = []) {
    return this.post('/export/simple_user', {
      department_id: departmentId,
      department_ids: departmentIds
    });
  }

  /**
   * 导出成员详情
   * @param {number} departmentId 部门 id
   */
  async exportUsersDetail(departmentId = 1) {
    return this.post('/export/user', { department_id: departmentId });
  }

  /**
   * 导出部门
   */
  async exportDepartments() {
    return this.post('/export/party', {});
  }

  /**
   * 导出标签成员
   * @param {number} tagId 标签 id
   */
  async exportTagUsers(tagId) {
    return this.post('/export/tag_users', { tagid: tagId });
  }

  /**
   * 获取导出结果
   * @param {string} jobId 任务 id
   */
  async getExportResult(jobId) {
    return this.post('/export/getresult', { jobid: jobId });
  }
}

module.exports = AddressBook;
