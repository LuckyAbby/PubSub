class PubSub {
  // 订阅
  subscribe(message, fn) {
    if(typeof fn !== 'function') {
      return false;
    }
    if (!PubSub.messages.hasOwnProperty(message)) {
	     PubSub.messages[message] = {};
    } else {
       const token = 'uid_' + String(++PubSub.lastUid);
	     PubSub.messages[message][token] = fn;
       return token;
    }
  }

  // 发布
  publish(message, data) {
    if(!this.messageHasSubscribers(message)) {
      return false;
    }
    const messageObj = PubSub.messages[message];
    for(const t in messageObj) {
      if(messageObj.hasOwnProperty(t)) {
        const fn = messageObj[t];
        setTimeout(fn(data), 0);
      }
    }
  }

  // 判断对象的实例上面是否有token的属性
  hasKeys(obj) {
    return Object.keys(obj).find(item => /^uid_\d+/.test(item)) === undefined ? false : true;
  }

  // 判断消息是否有订阅者
  messageHasSubscribers(message) {
    return PubSub.messages.hasOwnProperty(message) && this.hasKeys(PubSub.messages[message]);
  }

  // 取消所有该事件的订阅项
  clearAllSubscribeOptions(value) {
    const message = PubSub.messages[value];
    for(const t in message) {
      if(message.hasOwnProperty(t)) {
        delete message[t];
      }
    }
  }

  // 取消订阅
  unsubscribe(value) {

   // 判断传入的参数是消息类型还是 token 还是函数
    const isMessage = typeof value === 'string' && PubSub.messages.hasOwnProperty(value);
    const isToken = typeof value === 'string' && !PubSub.messages.hasOwnProperty(value);
    const isFunction = typeof value === 'function';

    if (isMessage) {
      this.clearAllSubscribeOptions(value);
      return true;
    }

    for (const m in PubSub.messages) {
      if (PubSub.messages.hasOwnProperty(m)) {
        const message = PubSub.messages[m];
        if(isToken && message[value]) {
          delete message[value];
          return true;
        }

        if(isFunction) {
          for (const t in message) {
            if(message.hasOwnProperty(t) && message[t] === value) {
              delete message[t];
              return true;
            }
          }
        }
      }
    }
  }
}

PubSub.messages = {};
PubSub.lastUid = -1;

module.exports = PubSub;