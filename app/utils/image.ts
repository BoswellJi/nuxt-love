// @ts-nocheck
let isSupportWebp = false;
try {
  isSupportWebp =
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
  // eslint-disable-next-line no-empty
} catch (err) {}

/**
 * 图片URL处理尺寸及webp
 * 本方法仅用于对后台上传的业务类图片进行处理，一般是运营位和线路图片
 * 前端页面中的固定图片禁止使用
 * 仅适用于pic[345].40017.cn和pavo.elongstatic.com两个域名下的图片
 * 对于elongstatic的图片，不支持任意尺寸，必须使用已申请过的tag，具体可在http://pavo.17usoft.com/查询
 * 对于pic[345].40017.cn的图片，支持任意尺寸，只传入width/height其中之一代表对图片进行等比例缩放不裁剪，width和height都传入时可通过cut参数控制裁剪
 * @param {object} param
 * @param {string} param.url 图片URL
 * @param {number} [param.width] 宽度
 * @param {number} [param.height] 高度
 * @param {number} [param.cut] 是否裁剪, 默认为false
 * @param {string} [param.tag] 仅适用于elongstatic.com
 * @returns string
 */
export let imageUrlFormat = ({ url, width = '', height = '', cut = false, tag = 'ori' }) => {
  if (typeof url !== 'string') return url;
  if (!/(pic[345]\.40017\.cn|pavo\.elongstatic\.com)/gi.test(url)) return url;

  url = url.replace('http://', 'https://');

  if (/pic\d+\.40017\.cn/.test(url)) {
    if (!width && !height) return url;

    url = url.replace(/\.webp$/gi, '');
    url = url.replace(/_(\d*)x(\d*)_(00|01|02|03)/gi, ''); // 先去掉源地址上已有的尺寸限制
    url = url.replace(
      /\.(jpg|png|jpeg)$/gi,
      `_${width}x${height}_${cut || (width && height) ? '00' : '02'}.$1`,
    );

    if (!isSupportWebp) return url;

    return url.replace(/\.(jpg|png|jpeg)$/gi, '.$1.webp');
  } else if (url.includes('pavo.elongstatic.com')) {
    return url.replace(/(pavo\.elongstatic\.com\/i\/)(.*)(\/)/gi, `$1${tag}$3`);
  } else {
    return url;
  }
};

export const htmlImageLazy = (html, clip = true, options = { width: 750 }) => {
  let newHtml = html.replace(/<img[^>]*>/gi, function (str) {
    const urlReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    const matReg = /src=\"(.*)\"/gi;
    const url = str.match(urlReg);
    // webp 图片最大像素尺寸为（16383 * 16383），富文本里面的图片往往超过了该限制
    // 故富文本里的图片默认不使用 webp 格式
    const clipUrl = clip ? imageUrlFormat({ url: url[1], ...options }) : url[1];
    const mat = str.replace(matReg, 'data-src=' + clipUrl + ' ');
    return mat;
  });
  return newHtml;
};
