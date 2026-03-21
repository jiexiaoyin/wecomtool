/**
 * 会议管理模块
 * API 章节：十七 - 会议
 * 包含：预约会议、会议统计、会中控制、网络研讨会、会议室等
 */

const WeComSDK = require('../sdk');

class Meeting extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 预约会议基础管理 ==========

  /**
   * 创建预约会议
   * @param {object} params 会议参数
   */
  async createMeeting(params) {
    const { topic, startTime, endTime, organizers, guests, meetingType, password, settings } = params;
    return this.post('/meeting/create', {
      topic,
      meeting_start_time: Math.floor(new Date(startTime).getTime() / 1000),
      meeting_end_time: Math.floor(new Date(endTime).getTime() / 1000),
      organizers,
      guests,
      meeting_type: meetingType || 1,
      password,
      settings: settings || {}
    });
  }

  /**
   * 修改预约会议
   * @param {string} meetingId 会议 id
   * @param {object} params 更新参数
   */
  async updateMeeting(meetingId, { topic, startTime, endTime, guests, password, settings }) {
    return this.post('/meeting/update', {
      meeting_id: meetingId,
      topic,
      meeting_start_time: startTime ? Math.floor(new Date(startTime).getTime() / 1000) : undefined,
      meeting_end_time: endTime ? Math.floor(new Date(endTime).getTime() / 1000) : undefined,
      guests,
      password,
      settings
    });
  }

  /**
   * 取消预约会议
   * @param {string} meetingId 会议 id
   */
  async cancelMeeting(meetingId) {
    return this.post('/meeting/cancel', { meeting_id: meetingId });
  }

  /**
   * 获取会议详情
   * @param {string} meetingId 会议 id
   */
  async getMeetingDetail(meetingId) {
    return this.post('/meeting/get', { meeting_id: meetingId });
  }

  /**
   * 获取成员会议 ID 列表
   * @param {string} userId 成员 userid
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   */
  async getUserMeetingIds(userId, startTime, endTime) {
    return this.post('/meeting/user_meeting_list', {
      userid: userId,
      meeting_start_time: startTime,
      meeting_end_time: endTime
    });
  }

  // ========== 会议统计管理 ==========

  /**
   * 获取会议发起记录
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {number} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getMeetingRecord(startTime, endTime, cursor = 0, size = 100) {
    return this.post('/meeting/get_meeting_record', {
      start_time: startTime,
      end_time: endTime,
      cursor,
      size
    });
  }

  // ========== 预约会议高级管理 ==========

  /**
   * 创建预约会议（高级）
   * @param {object} params 会议参数
   */
  async createMeetingAdvanced(params) {
    const {
      topic, startTime, endTime, meetingType, password,
      hosts, organizers, recurrenceType, recurrenceUntil,
      attendees, allowIn, allowOut, mute, settings
    } = params;

    const meetingInfo = {
      topic,
      meeting_start_time: Math.floor(new Date(startTime).getTime() / 1000),
      meeting_end_time: Math.floor(new Date(endTime).getTime() / 1000),
      meeting_type: meetingType || 1,
      password,
      hosts,
      organizers
    };

    if (recurrenceType) {
      meetingInfo.recurrence_type = recurrenceType;
      meetingInfo.recurrence_until = recurrenceUntil;
    }

    if (attendees) meetingInfo.attendees = attendees;

    meetingInfo.settings = settings || {
      allow_in: allowIn !== undefined ? allowIn : true,
      allow_out: allowOut !== undefined ? allowOut : true,
      mute: mute !== undefined ? mute : 1
    };

    return this.post('/meeting/create', meetingInfo);
  }

  /**
   * 获取会议受邀成员列表
   * @param {string} meetingId 会议 id
   */
  async getMeetingAttendees(meetingId) {
    return this.post('/meeting/get_attendees', { meeting_id: meetingId });
  }

  /**
   * 更新会议受邀成员列表
   * @param {string} meetingId 会议 id
   * @param {object} params 参数
   */
  async updateMeetingAttendees(meetingId, { attendees, updateScope }) {
    return this.post('/meeting/update_attendees', {
      meeting_id: meetingId,
      attendees,
      update_scope: updateScope
    });
  }

  /**
   * 获取用户专属参会链接
   * @param {string} meetingId 会议 id
   * @param {string} userId 用户 userid
   */
  async getUserMeetingJoinLink(meetingId, userId) {
    return this.post('/meeting/get_user_meeting_link', {
      meeting_id: meetingId,
      userid: userId
    });
  }

  /**
   * 获取实时会中成员列表
   * @param {string} meetingId 会议 id
   */
  async getMeetingMembers(meetingId) {
    return this.post('/meeting/get_meeting_members', { meeting_id: meetingId });
  }

  // ========== 会中控制管理 ==========

  /**
   * 管理会中设置
   * @param {string} meetingId 会议 id
   * @param {object} settings 设置参数
   */
  async updateMeetingSettings(meetingId, settings) {
    return this.post('/meeting/update_meeting', {
      meeting_id: meetingId,
      settings
    });
  }

  /**
   * 管理联席主持人
   * @param {string} meetingId 会议 id
   * @param {string[]} userIds 成员 userid 列表
   * @param {number} type 1-添加 2-删除
   */
  async manageCoHost(meetingId, userIds, type = 1) {
    return this.post('/meeting/set_co_host', {
      meeting_id: meetingId,
      userid: userIds,
      type
    });
  }

  /**
   * 静音成员
   * @param {string} meetingId 会议 id
   * @param {string[]} userIds 成员 userid 列表
   * @param {boolean} muteAll 是否全员静音
   */
  async muteMember(meetingId, userIds, muteAll = false) {
    return this.post('/meeting/mute_member', {
      meeting_id: meetingId,
      userid: userIds,
      mute_all: muteAll
    });
  }

  /**
   * 关闭或开启成员视频
   * @param {string} meetingId 会议 id
   * @param {string} userId 成员 userid
   * @param {boolean} muteVideo 是否关闭视频
   */
  async updateMemberVideo(meetingId, userId, muteVideo = true) {
    return this.post('/meeting/mute_video', {
      meeting_id: meetingId,
      userid: userId,
      mute_video: muteVideo
    });
  }

  /**
   * 关闭成员屏幕共享
   * @param {string} meetingId 会议 id
   * @param {string} userId 成员 userid
   */
  async stopMemberScreenShare(meetingId, userId) {
    return this.post('/meeting/stop_screen_share', {
      meeting_id: meetingId,
      userid: userId
    });
  }

  /**
   * 管理等候室成员
   * @param {string} meetingId 会议 id
   * @param {string} userId 成员 userid
   * @param {number} type 1-进入等候室 2-移出等候室 3-进入会议
   */
  async manageWaitingRoom(meetingId, userId, type) {
    return this.post('/meeting/waiting_room', {
      meeting_id: meetingId,
      userid: userId,
      type
    });
  }

  /**
   * 移出成员
   * @param {string} meetingId 会议 id
   * @param {string[]} userIds 成员 userid 列表
   */
  async kickMember(meetingId, userIds) {
    return this.post('/meeting/kick', {
      meeting_id: meetingId,
      userid: userIds
    });
  }

  /**
   * 结束会议
   * @param {string} meetingId 会议 id
   */
  async endMeeting(meetingId) {
    return this.post('/meeting/end', { meeting_id: meetingId });
  }

  // ========== 网络研讨会管理 ==========

  /**
   * 创建网络研讨会
   * @param {object} params 研讨会参数
   */
  async createWebinar(params) {
    const { topic, startTime, endTime, password, hosts, guests, settings } = params;
    return this.post('/meeting/webinar/create', {
      topic,
      meeting_start_time: Math.floor(new Date(startTime).getTime() / 1000),
      meeting_end_time: Math.floor(new Date(endTime).getTime() / 1000),
      password,
      hosts,
      guests,
      settings: settings || {}
    });
  }

  /**
   * 修改网络研讨会
   * @param {string} webinarId 研讨会 id
   * @param {object} params 更新参数
   */
  async updateWebinar(webinarId, params) {
    return this.post('/meeting/webinar/update', {
      webinar_id: webinarId,
      ...params
    });
  }

  /**
   * 取消网络研讨会
   * @param {string} webinarId 研讨会 id
   */
  async cancelWebinar(webinarId) {
    return this.post('/meeting/webinar/cancel', { webinar_id: webinarId });
  }

  /**
   * 获取网络研讨会详情
   * @param {string} webinarId 研讨会 id
   */
  async getWebinarDetail(webinarId) {
    return this.post('/meeting/webinar/get', { webinar_id: webinarId });
  }

  // ========== 会议室管理 (Rooms) ==========

  /**
   * 预定 Rooms 会议室
   * @param {string} roomId 会议室 id
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} userId 预定人 userid
   */
  async bookRoom(roomId, startTime, endTime, userId) {
    return this.post('/meeting/rooms/book', {
      room_id: roomId,
      start_time: startTime,
      end_time: endTime,
      userid: userId
    });
  }

  /**
   * 释放 Rooms 会议室
   * @param {string} roomId 会议室 id
   * @param {string} meetingId 会议 id
   */
  async releaseRoom(roomId, meetingId) {
    return this.post('/meeting/rooms/release', {
      room_id: roomId,
      meeting_id: meetingId
    });
  }

  /**
   * 获取 Rooms 会议室列表
   * @param {number} offset 偏移量
   * @param {number} size 每页数量
   */
  async getRoomsList(offset = 0, size = 100) {
    return this.post('/meeting/rooms/list', { offset, limit: size });
  }

  /**
   * 获取 Rooms 会议室详情
   * @param {string} roomId 会议室 id
   */
  async getRoomDetail(roomId) {
    return this.post('/meeting/rooms/get', { room_id: roomId });
  }

  /**
   * 呼叫 Rooms 会议室
   * @param {string} roomId 会议室 id
   * @param {string} userId 呼叫人 userid
   */
  async callRoom(roomId, userId) {
    return this.post('/meeting/rooms/call', {
      room_id: roomId,
      userid: userId
    });
  }

  /**
   * 取消呼叫 Rooms 会议室
   * @param {string} roomId 会议室 id
   */
  async cancelCallRoom(roomId) {
    return this.post('/meeting/rooms/cancel', { room_id: roomId });
  }

  // ========== 录制管理 ==========

  /**
   * 获取会议录制列表
   * @param {string} meetingId 会议 id
   */
  async getMeetingRecordings(meetingId) {
    return this.post('/meeting/record/get_list', { meeting_id: meetingId });
  }

  /**
   * 获取会议录制地址
   * @param {string} meetingId 会议 id
   */
  async getMeetingRecordingUrl(meetingId) {
    return this.post('/meeting/record/get_url', { meeting_id: meetingId });
  }

  /**
   * 删除会议录制
   * @param {string} meetingId 会议 id
   */
  async deleteMeetingRecording(meetingId) {
    return this.post('/meeting/record/delete', { meeting_id: meetingId });
  }

  /**
   * 修改会议录制共享设置
   * @param {string} meetingId 会议 id
   * @param {number} shareType 共享类型
   */
  async updateRecordingShare(meetingId, shareType) {
    return this.post('/meeting/record/set_share', {
      meeting_id: meetingId,
      share_type: shareType
    });
  }

  // ========== 会议投票管理 ==========

  /**
   * 创建会议投票主题
   * @param {string} meetingId 会议 ID
   * @param {object} vote 投票配置
   */
  async createMeetingVote(meetingId, vote) {
    return this.post('/meeting/vote/create', {
      meeting_id: meetingId,
      vote
    });
  }

  /**
   * 修改会议投票主题
   * @param {string} meetingId 会议 ID
   * @param {string} voteId 投票 ID
   * @param {object} vote 投票配置
   */
  async updateMeetingVote(meetingId, voteId, vote) {
    return this.post('/meeting/vote/update', {
      meeting_id: meetingId,
      vote_id: voteId,
      vote
    });
  }

  /**
   * 获取会议投票列表
   * @param {string} meetingId 会议 ID
   */
  async getMeetingVoteList(meetingId) {
    return this.post('/meeting/vote/list', { meeting_id: meetingId });
  }

  /**
   * 获取会议投票详情
   * @param {string} meetingId 会议 ID
   * @param {string} voteId 投票 ID
   */
  async getMeetingVoteDetail(meetingId, voteId) {
    return this.post('/meeting/vote/get', {
      meeting_id: meetingId,
      vote_id: voteId
    });
  }

  /**
   * 删除会议投票
   * @param {string} meetingId 会议 ID
   * @param {string} voteId 投票 ID
   */
  async deleteMeetingVote(meetingId, voteId) {
    return this.post('/meeting/vote/delete', {
      meeting_id: meetingId,
      vote_id: voteId
    });
  }

  /**
   * 发起会议投票
   * @param {string} meetingId 会议 ID
   * @param {string} voteId 投票 ID
   */
  async startMeetingVote(meetingId, voteId) {
    return this.post('/meeting/vote/start', {
      meeting_id: meetingId,
      vote_id: voteId
    });
  }

  /**
   * 结束会议投票
   * @param {string} meetingId 会议 ID
   * @param {string} voteId 投票 ID
   */
  async endMeetingVote(meetingId, voteId) {
    return this.post('/meeting/vote/end', {
      meeting_id: meetingId,
      vote_id: voteId
    });
  }

  // ========== 会议布局和背景管理 ==========

  /**
   * 获取布局模板列表
   */
  async getLayoutTemplateList() {
    return this.post('/meeting/layout/list', {});
  }

  /**
   * 添加会议基础布局
   * @param {object} layout 布局配置
   */
  async addBasicLayout(layout) {
    return this.post('/meeting/layout/add', layout);
  }

  /**
   * 添加会议高级布局
   * @param {object} layout 布局配置
   */
  async addAdvancedLayout(layout) {
    return this.post('/meeting/layout/add_advanced', layout);
  }

  /**
   * 修改会议基础布局
   * @param {string} layoutId 布局 ID
   * @param {object} layout 布局配置
   */
  async updateBasicLayout(layoutId, layout) {
    return this.post('/meeting/layout/update', {
      layout_id: layoutId,
      ...layout
    });
  }

  /**
   * 设置会议默认布局
   * @param {string} meetingId 会议 ID
   * @param {string} layoutId 布局 ID
   */
  async setDefaultLayout(meetingId, layoutId) {
    return this.post('/meeting/layout/set_default', {
      meeting_id: meetingId,
      layout_id: layoutId
    });
  }

  /**
   * 获取会议布局列表
   * @param {string} meetingId 会议 ID
   */
  async getMeetingLayoutList(meetingId) {
    return this.post('/meeting/layout/get_list', { meeting_id: meetingId });
  }

  /**
   * 获取用户布局
   * @param {string} userId 用户 ID
   */
  async getUserLayout(userId) {
    return this.post('/meeting/layout/get_user_layout', { userid: userId });
  }

  /**
   * 批量删除布局
   * @param {string[]} layoutIds 布局 ID 列表
   */
  async batchDeleteLayout(layoutIds) {
    return this.post('/meeting/layout/batch_delete', { layout_ids: layoutIds });
  }

  /**
   * 添加会议背景
   * @param {string} filePath 背景文件路径
   * @param {string} type 背景类型: default, custom
   */
  async addMeetingBackground(filePath, type = 'custom') {
    return this.uploadFile(filePath, 'media', { type });
  }

  /**
   * 获取会议背景列表
   */
  async getMeetingBackgroundList() {
    return this.post('/meeting/background/list', {});
  }

  /**
   * 设置会议默认背景
   * @param {string} backgroundId 背景 ID
   */
  async setDefaultBackground(backgroundId) {
    return this.post('/meeting/background/set_default', { background_id: backgroundId });
  }

  /**
   * 删除会议背景
   * @param {string} backgroundId 背景 ID
   */
  async deleteMeetingBackground(backgroundId) {
    return this.post('/meeting/background/delete', { background_id: backgroundId });
  }

  // ========== MRA会议室连接器管理 ==========

  /**
   * 获取 MRA 状态信息
   * @param {string} deviceId 设备 ID
   */
  async getMraStatus(deviceId) {
    return this.post('/meeting/mra/status', { device_id: deviceId });
  }

  /**
   * 切换 MRA 默认布局
   * @param {string} deviceId 设备 ID
   * @param {string} layoutId 布局 ID
   */
  async switchMraLayout(deviceId, layoutId) {
    return this.post('/meeting/mra/switch_layout', {
      device_id: deviceId,
      layout_id: layoutId
    });
  }

  /**
   * 设置 MRA 举手或手放下
   * @param {string} deviceId 设备 ID
   * @param {number} handStatus 举手状态: 0-放下 1-举手
   */
  async setMraHand(deviceId, handStatus) {
    return this.post('/meeting/mra/hand', {
      device_id: deviceId,
      hand_status: handStatus
    });
  }

  /**
   * 挂断 MRA 呼叫
   * @param {string} deviceId 设备 ID
   */
  async hangupMra(deviceId) {
    return this.post('/meeting/mra/hangup', { device_id: deviceId });
  }
}

module.exports = Meeting;
