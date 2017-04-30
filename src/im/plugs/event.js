/**
 * 事件包装类
 *
 * @example
 * ```
        import EventClass from '../Event';

        let exports = {...};    //你的对象，传入构造函数后会为其增加on off 属性
        let Event = new EventClass(exports);

        Event.trigger('xxx');

        Event.pack(exports);    //如果在实例化时，没有传入对象到构造函数，可以用pack方法重新包装。

        exports.on('xxx',()=>{});
        exports.off('xxx',fn);
        exports.off('xxx');
 * ```
 */
class CLASS_EVENT{

    constructor(o){
        this.event = {};
        this.pack(o);
    }

    pack(o){
        if(o){
            o.on = this.on.bind(this);
            o.off = this.off.bind(this);
        }
    }

    on(eventName, eventFn){
        let event = this.event;
        !event[eventName] && (event[eventName] = []);

        event[eventName].push(eventFn);
    }

    off(eventName, eventFn){
        let event = this.event;
        let e = event[eventName];

        if(e){
            let index = e.findIndex(fn=>fn===eventFn);
            if(index){
                e.splice(index,1);
            }else if(!eventFn){
                event.delete(eventName);
            }else if(!eventName){
                console.warn(`没有找到事件${eventName}，注销事件失败。`);
            }
        }
    }

    trigger(eventName){
        let event = this.event;
        let events = event[eventName];
        events && events.forEach((fn)=>{fn();});
    }
}

export default CLASS_EVENT;







