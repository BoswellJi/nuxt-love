var trackInit = () => {
  window._tcq = window._tcq || [];
  var _timediff = -1;
  if (typeof window._tcopentime != 'undefined') {
    _timediff = new Date().getTime() - window._tcopentime;
  }
  window._tcq.push(['_serialid', '0']); //如果是下单页面，需要传入订单号，多个订单号用下划分割 "_"

  window._tcq.push(['_vrcode', '10244-12-0']); //产品号见下面解释，最后一位默认为0，写成其他的统计不到，此条代码最重要

  window._tcq.push(['_refId', '']); //Refid需要传入来源refid，不同平台的读取方法不同，项目自己读取Refid
  window._tcq.push(['_userId', '']); //传入访问者中登录的会员ID，未登录的为0，不同平台的读取方法不同，项目自己读取会员ID
  window._tcq.push(['_openTime', _timediff]);
  window._tcq.push(['_trackPageview', location.pathname]); //虚拟url，项目自己定义,如:/Touch站/首页，只针对微信，在此项原基础上修改为：_tcq.push(['_trackPageview', ' openid||xxx ']),即在pageview所传值的前面加“openid||”（即openid+双竖线）
  window._tcq.push(['_resId', '0']); //新增项：资源id（只针对详情页\交通类项目的订单填写页  需要添加该项）----有疑问可联系@支夏萍
  window._tcq.push(['_qdid', '']); //新增项：市场渠道id（用于区分市场中心各个部门）----有疑问可联系@支夏萍
  window._tcq.push(['extendUserId', '']); //新增项：扩展用户id
  // window._tcq.push(['_flag', false]); //关闭自动数据收集，必须手动调用此方法_tcTraObj._tcTrackPage(pagename,orgpagename)
};
