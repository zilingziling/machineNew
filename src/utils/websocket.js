import config from '../../config/config';
import { uint8Buff2Str } from '@/utils/func';
const urlDev = 'ws://172.16.3.104:18880/room';
const urlPro = `ws://${window.location.hostname}:28880/room`;
let seqno = 0;
export const webSocket = () => {
  try {
    let ws = new WebSocket(urlDev);
    window.ws = ws;
    ws.onopen = function(evt) {
      console.log('websocket open ...');
      ws.binaryType = 'arraybuffer';
      send(ws, {}, proto.cn.yjtianxia.im.protocol2.MSGTYPE.HANDSHAKE);
    };

    ws.onmessage = function(evt) {
      let baseMsg = proto.cn.yjtianxia.im.protocol2.BaseMsg.deserializeBinary(evt.data);
      let objdata;
      try {
        objdata = uint8Buff2Str(baseMsg.getData());
        console.log('Received websocketMessage: ' + objdata);
      } catch (error) {}
    };

    ws.onclose = function(evt) {
      console.log('websocket closed.');
    };
  } catch (e) {
    console.log('websocketErr', e);
  }
};
const send = (ws, msg, datatype) => {
  if (ws && ws.readyState === 1) {
    let jsonStr = msg;
    let baseMsg = new proto.cn.yjtianxia.im.protocol2.BaseMsg();
    baseMsg.setSrc(window.localStorage.getItem('account'));
    baseMsg.addDst('ytj_logic');
    baseMsg.setMsgType(datatype);
    baseMsg.setData(str2Uint8Buff(jsonStr));
    baseMsg.setSeqNo(seqno++);
    let crc = 'webcrc';
    baseMsg.setCrc(str2Uint8Buff(crc));
    ws.send(baseMsg.serializeBinary());
  } else {
    console.log('send error, websocket is not ready');
  }
};
const str2Uint8Buff = strData => {
  //发送格式数据
  var x2 = new Uint8Array(strData.length);
  for (var i = 0; i < strData.length; i++) {
    x2[i] = strData.charCodeAt(i);
  }
  return x2;
};
