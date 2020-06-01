import React, { useEffect, useState } from 'react';
import './video.scss';
const VideoDistract = ({ refreshPlay, FullScreen }) => {
  useEffect(() => _infos());
  const _infos = () => {
    window.YjFPlayer = {
      onEvent: str => {
        if (str == 'PLAYER_INIT_DONE') {
          //默认情况下播放
          setTimeout(() => {
            refreshPlay();
          }, 1);
        } else if (str == 'PLAYER_SCREEN_FULL') {
          //全屏情况下播放
          setTimeout(() => {
            FullScreen();
          }, 1);
        } else if (str == 'PLAYER_SCREEN_NORMAL') {
          //退出全屏情况下播放
          setTimeout(() => {
            refreshPlay();
          }, 1);
        }
      },
    };
  };
  return (
    <div className="videoWrap">
      {/* 视频 */}
      <div>
        <div className="video">
          {/* flash更新过后防止页面缓存的是上个版本falsh版本设置?param=0.0xx  */}
          <object
            classID="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            width="610"
            height="215"
            id="XKFlashPlayer"
          >
            <param name="movie" value="HWFlashPlayer.swf?param=2.0" />
            <param name="quality" value="high" />
            <param name="bgcolor" value="#000000" />
            <param name="allowScriptAccess" value="always" />
            <param name="allowFullScreen" value="true" />
            <param name="wmode" value="window" />
            {/* <!--[if !IE]>--> */}
            <object
              type="application/x-shockwave-flash"
              data="HWFlashPlayer.swf?param=2.0"
              width="610"
              height="215"
              id="XKFlashPlayer"
            >
              <param name="quality" value="high" />
              <param name="bgcolor" value="#000000" />
              <param name="allowScriptAccess" value="always" />
              <param name="allowFullScreen" value="true" />
              <param name="wmode" value="window" />
              {/* <!--<![endif]-->
            		<!--[if gte IE 6]>--> */}
              <p>
                请点击下面图标，选择允许
                {/* Either scripts and active content are not permitted to run or Adobe Flash Player version
									10.0.0 or greater is not installed. */}
              </p>
              {/* <!--<![endif]--> */}
              <a href="http://www.adobe.com/go/getflashplayer">
                <img
                  src={require('../../../assets/img/get_flash_player.gif')}
                  alt="Get Adobe Flash Player"
                />
              </a>
              {/* <!--[if !IE]>--> */}
            </object>
            {/* <!--<![endif]--> */}
          </object>
        </div>
      </div>
    </div>
  );
};

export default VideoDistract;
export const diff = (obj1, obj2) => {
  var o1 = obj1 instanceof Object;
  var o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2;
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object;
    var t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
};
