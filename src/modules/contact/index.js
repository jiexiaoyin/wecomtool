/**
 * 客户联系模块
 * API 章节：十三 - 客户联系
 * 包含：客户管理、客户标签、离职/在职继承、客户群、规则组、联系我等
 */

const WeComSDK = require('../../sdk');

class Contact extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 成员对外信息 ==========

  /**
   * 获取成员对外信息
   * @param {string} userId 成员 userid
   */
  async getExternalUserInfo(userId) {
    return this.post('/externalcontact/get_external_user_info', { userid: userId });
  }

  /**
   * 设置成员对外信息
   * @param {string} userId 成员 userid
   * @param {object} externalCorpInfo 企业信息
   * @param {object} externalName 对外名称
   */
  async setExternalUserInfo(userId, externalCorpInfo, externalName) {
    return this.post('/externalcontact/set_external_user_info', {
      userid: userId,
      external_corp_info: externalCorpInfo,
      external_name: externalName
    });
  }

  // ========== 企业服务人员管理 ==========

  /**
   * 获取配置了客户联系功能的成员列表
   */
  async getCustomerContactUsers() {
    return this.post('/externalcontact/get_customer_contact_list', {});
  }

  // ========== 客户管理 ==========

  /**
   * 获取客户列表
   * @param {string} userId 成员 userid
   * @param {string} cursor 分页游标
   */
  async getCustomerList(userId, cursor = '') {
    return this.get('/externalcontact/list', { userid: userId, cursor });
  }

  /**
   * 获取客户详情
   * @param {string} userId 成员 userid
   * @param {string} externalUserId 外部联系人 userid
   */
  async getCustomerDetail(userId, externalUserId) {
    return this.get('/externalcontact/get', { userid: userId, external_userid: externalUserId });
  }

  /**
   * 批量获取客户详情
   * @param {string} userId 成员 userid
   * @param {string[]} externalUserIds 外部联系人 userid 列表
   */
  async batchGetCustomers(userId, externalUserIds) {
    return this.post('/externalcontact/batch_get_by_user', {
      userid: userId,
      external_userid: externalUserIds
    });
  }

  /**
   * 修改客户备注信息
   * @param {string} userId 成员 userid
   * @param {string} externalUserId 外部联系人 userid
   * @param {object} params 备注参数
   */
  async updateCustomerRemark(userId, externalUserId, params = {}) {
    const { remark, description, addRemark, mobile, corporateName, position } = params;
    return this.post('/externalcontact/update_remark', {
      userid: userId,
      external_userid: externalUserId,
      remark,
      description,
      add_remark: addRemark,
      mobile,
      corporate_name: corporateName,
      position
    });
  }

  // ========== 客户标签管理 ==========

  /**
   * 获取企业标签列表
   */
  async getCorpTags() {
    return this.post('/externalcontact/get_corp_tag_list', {});
  }

  /**
   * 添加企业标签
   * @param {string} groupId 标签组id
   * @param {string} tagName 标签名
   * @param {string} groupName 标签组名称（新建组时使用）
   */
  async addCorpTag(groupId, tagName, groupName = '') {
    return this.post('/externalcontact/add_corp_tag', { 
      group_id: groupId, 
      tag_name: tagName,
      group_name: groupName
    });
  }

  /**
   * 编辑企业标签
   * @param {string} tagId 标签id
   * @param {string} tagName 新标签名
   */
  async updateCorpTag(tagId, tagName) {
    return this.post('/externalcontact/edit_corp_tag', { id: tagId, name: tagName });
  }

  /**
   * 删除企业标签
   * @param {string} tagId 标签id
   */
  async deleteCorpTag(tagId) {
    return this.post('/externalcontact/del_corp_tag', { tag_id: tagId });
  }

  /**
   * 编辑客户企业标签
   * @param {string} userId 成员 userid
   * @param {string} externalUserId 外部联系人 userid
   * @param {string[]} addTag 添加的标签
   * @param {string[]} removeTag 删除的标签
   */
  async updateCustomerTags(userId, externalUserId, { addTag = [], removeTag = [] } = {}) {
    return this.post('/externalcontact/mark_tag', {
      userid: userId,
      external_userid: externalUserId,
      add_tag: addTag,
      remove_tag: removeTag
    });
  }

  // ========== 客户联系规则组管理 ==========

  /**
   * 获取客户联系规则组列表
   */
  async getContactRuleGroups() {
    return this.post('/externalcontact/get_contact_rule_groups', {});
  }

  /**
   * 获取客户联系规则组详情
   * @param {string} ruleGroupId 规则组 ID
   */
  async getContactRuleGroupDetail(ruleGroupId) {
    return this.post('/externalcontact/get_contact_rule_group_detail', { rule_group_id: ruleGroupId });
  }

  /**
   * 创建客户联系规则组
   * @param {object} ruleGroup 规则组配置
   */
  async createContactRuleGroup(ruleGroup) {
    return this.post('/externalcontact/add_contact_rule_group', ruleGroup);
  }

  /**
   * 更新客户联系规则组
   * @param {string} ruleGroupId 规则组 ID
   * @param {object} ruleGroup 规则组配置
   */
  async updateContactRuleGroup(ruleGroupId, ruleGroup) {
    return this.post('/externalcontact/update_contact_rule_group', {
      rule_group_id: ruleGroupId,
      ...ruleGroup
    });
  }

  /**
   * 删除客户联系规则组
   * @param {string} ruleGroupId 规则组 ID
   */
  async deleteContactRuleGroup(ruleGroupId) {
    return this.post('/externalcontact/del_contact_rule_group', { rule_group_id: ruleGroupId });
  }

  // ========== 离职继承 ==========

  /**
   * 获取待分配的离职成员列表
   * @param {number} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getDimissionList(cursor = 0, size = 100) {
    return this.post('/externalcontact/get_unassigned_list', { cursor, limit: size });
  }

  /**
   * 分配离职成员的客户
   * @param {string} externalUserId 外部联系人 userid
   * @param {string} handoverUserId 交接人 userid
   * @param {string} takeOverUserId 接替人 userid
   */
  async transferCustomer(externalUserId, handoverUserId, takeOverUserId) {
    return this.post('/externalcontact/transfer_customer', {
      external_userid: externalUserId,
      handover_userid: handoverUserId,
      takeover_userid: takeOverUserId
    });
  }

  /**
   * 批量分配离职成员的客户
   * @param {string} handoverUserId 交接人 userid
   * @param {string} takeOverUserId 接替人 userid
   * @param {string[]} externalUserIds 外部联系人 userid 列表
   */
  async batchTransferCustomers(handoverUserId, takeOverUserId, externalUserIds) {
    return this.post('/externalcontact/transfer_customer', {
      handover_userid: handoverUserId,
      takeover_userid: takeOverUserId,
      external_userid: externalUserIds
    });
  }

  /**
   * 查询客户接替状态
   * @param {string} externalUserId 外部联系人 userid
   * @param {string} takeOverUserId 接替人 userid
   */
  async getTransferResult(externalUserId, takeOverUserId) {
    return this.post('/externalcontact/get_transfer_result', {
      external_userid: externalUserId,
      takeover_userid: takeOverUserId
    });
  }

  // ========== 在职继承 ==========

  /**
   * 分配在职成员的客户
   * @param {string} externalUserId 外部联系人 userid
   * @param {string} userId 原跟进人 userid
   * @param {string} newUserId 新跟进人 userid
   */
  async transferOnJobCustomer(externalUserId, userId, newUserId) {
    return this.post('/externalcontact/resigned/transfer_customer', {
      external_userid: externalUserId,
      handed_userid: userId,
      new_handover_userid: newUserId
    });
  }

  /**
   * 分配在职成员的客户群
   * @param {string} chatId 群聊 id
   * @param {string} newOwner 新群主 userid
   */
  async transferOnJobGroupChat(chatId, newOwner) {
    return this.post('/externalcontact/groupchat/transfer_customer', {
      chat_id: chatId,
      new_owner: newOwner
    });
  }

  // ========== 客户群管理 ==========

  /**
   * 获取客户群列表
   * @param {string} cursor 分页游标
   * @param {number} size 每页数量
   * @param {number} statusFilter 群状态过滤: 0-正常 1-跟进人离职 2-离职继承中 3-离职继承完成
   */
  async getGroupChatList(cursor = '', size = 100, statusFilter = 0) {
    return this.post('/externalcontact/groupchat/list', { 
      cursor, 
      limit: size,
      status_filter: statusFilter
    });
  }

  /**
   * 获取客户群详情
   * @param {string} chatId 群聊 id
   */
  async getGroupChatDetail(chatId) {
    return this.post('/externalcontact/groupchat/get', { chat_id: chatId });
  }

  /**
   * 客户群 opengid 转换
   * @param {string} opengid 开放群 ID
   */
  async convertOpenChatId(opengid) {
    return this.post('/externalcontact/groupchat/opentochat', { opengid });
  }

  // ========== 联系我与客户入群方式 ==========

  /**
   * 获取联系我列表
   */
  async getContactWayList() {
    return this.post('/externalcontact/get_contact_way_list', {});
  }

  /**
   * 获取联系我详情
   * @param {string} configId 联系方式配置 ID
   */
  async getContactWayDetail(configId) {
    return this.post('/externalcontact/get_contact_way', { config_id: configId });
  }

  /**
   * 添加联系我方式
   * @param {object} params 联系方式参数
   */
  async addContactWay(params) {
    const { type, scene, style, remark, skipVerify, state, userIds, departmentIds } = params;
    return this.post('/externalcontact/add_contact_way', {
      type,
      scene,
      style,
      remark,
      skip_verify: skipVerify,
      state,
      user: userIds,
      party: departmentIds
    });
  }

  /**
   * 更新联系我方式
   * @param {string} configId 联系方式配置 ID
   * @param {object} params 更新参数
   */
  async updateContactWay(configId, params) {
    const { style, remark, skipVerify, state, userIds, departmentIds } = params;
    return this.post('/externalcontact/update_contact_way', {
      config_id: configId,
      style,
      remark,
      skip_verify: skipVerify,
      state,
      user: userIds,
      party: departmentIds
    });
  }

  /**
   * 删除联系我方式
   * @param {string} configId 联系方式配置 ID
   */
  async deleteContactWay(configId) {
    return this.post('/externalcontact/del_contact_way', { config_id: configId });
  }

  // ========== 客户群「加入群聊」管理 ==========

  /**
   * 获取群聊邀请方式列表
   */
  async getJoinWayList() {
    return this.post('/externalcontact/get_join_way_list', {});
  }

  /**
   * 获取群聊邀请方式详情
   * @param {string} configId 群聊邀请方式 ID
   */
  async getJoinWayDetail(configId) {
    return this.post('/externalcontact/get_join_way', { config_id: configId });
  }

  /**
   * 添加群聊邀请方式
   * @param {object} params 邀请方式参数
   */
  async addJoinWay(params) {
    const { chatId, scene, style, remark, skipVerify, state } = params;
    return this.post('/externalcontact/add_join_way', {
      chat_id: chatId,
      scene,
      style,
      remark,
      skip_verify: skipVerify,
      state
    });
  }

  /**
   * 更新群聊邀请方式
   * @param {string} configId 群聊邀请方式 ID
   * @param {object} params 更新参数
   */
  async updateJoinWay(configId, params) {
    const { style, remark, skipVerify, state } = params;
    return this.post('/externalcontact/update_join_way', {
      config_id: configId,
      style,
      remark,
      skip_verify: skipVerify,
      state
    });
  }

  /**
   * 删除群聊邀请方式
   * @param {string} configId 群聊邀请方式 ID
   */
  async deleteJoinWay(configId) {
    return this.post('/externalcontact/del_join_way', { config_id: configId });
  }

  // ========== 商品图册 ==========

  /**
   * 获取商品图册列表
   */
  async getProductAlbumList() {
    return this.post('/externalcontact/get_product_album_list', {});
  }

  /**
   * 添加商品图册
   * @param {object} product 商品信息
   */
  async addProductAlbum(product) {
    return this.post('/externalcontact/add_product_album', product);
  }

  /**
   * 编辑商品图册
   * @param {string} productId 商品 ID
   * @param {object} product 商品信息
   */
  async updateProductAlbum(productId, product) {
    return this.post('/externalcontact/update_product_album', {
      product_id: productId,
      ...product
    });
  }

  /**
   * 删除商品图册
   * @param {string} productId 商品 ID
   */
  async deleteProductAlbum(productId) {
    return this.post('/externalcontact/del_product_album', { product_id: productId });
  }

  // ========== 已服务客户 ==========

  /**
   * 获取已服务的外部联系人
   * @param {string} userId 成员 userid
   * @param {string} cursor 分页游标
   */
  async getServedCustomers(userId, cursor = '') {
    return this.post('/externalcontact/get_served_list', {
      userid: userId,
      cursor
    });
  }
}

module.exports = Contact;
