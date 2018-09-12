import request from "request"
import * as builder from "botbuilder"
import * as restify from "restify"
import * as async from "async"

function moveFieldsTo(frm, to, fields) {
    if (frm && to) {
        for (var f in fields) {
            if (frm.hasOwnProperty(f)) {
                if (typeof to[f] === 'function') {
                    to[fields[f]](frm[f]);
                }
                else {
                    to[fields[f]] = frm[f];
                }
                delete frm[f];
            }
        }
    }
}

function clone(obj) {
    var cpy = {};
    if (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cpy[key] = obj[key];
            }
        }
    }
    return cpy;
}

function joinPath(...paths: string[]): string {
    return paths.reduce((path, chunck) => {
        if (path.length > 0) {
            return (path.endsWith("/") ? path : path + "/") + (chunck.startsWith("/") ? chunck.slice(1, chunck.length) : chunck)
        } else return chunck
    },"")
}


const toAddress = {
    'id': 'id',
    'channelId': 'channelId',
    'from': 'user',
    'conversation': 'conversation',
    'recipient': 'bot',
    'serviceUrl': 'serviceUrl'
};

export type CustomChatConnectorProps = {
    directlinePath?: string
} 
const defaultProps: CustomChatConnectorProps = {
    directlinePath: `${process.env.DIRECTLINE_HOST}/directline/conversations/`
}

export class CustomChatConnector implements builder.IConnector, builder.IBotStorage {
    
    convPath: string
    onInvokeHandler: (event: builder.IEvent, callback?: (err: Error, body: any, status?: number) => void) => void
    onEventHandler: (events: builder.IEvent[], callback?: (err: Error) => void) => void

    constructor(props?: CustomChatConnectorProps) {
        props = props ? props : defaultProps
        this.convPath = props.directlinePath ? props.directlinePath : defaultProps.directlinePath
    }

    listen() {
        return (req: restify.Request, res: restify.Response, next: restify.Next) => {
            this.dispatchEvent(req.body, res, next)
        }
    }

    isInvoke(event) {
        return (event && event.type && event.type.toLowerCase() == "invoke");
    };


    prepOutgoingMessage(msg) {
        if (msg.attachments) {
            var attachments = [];
            for (var i = 0; i < msg.attachments.length; i++) {
                var a = msg.attachments[i];
                switch (a.contentType) {
                    case 'application/vnd.microsoft.keyboard':
                        if (msg.address.channelId == 'facebook') {
                            msg.sourceEvent = { quick_replies: [] };
                            a.content.buttons.forEach(function (action) {
                                switch (action.type) {
                                    case 'imBack':
                                    case 'postBack':
                                        msg.sourceEvent.quick_replies.push({
                                            content_type: 'text',
                                            title: action.title,
                                            payload: action.value
                                        });
                                        break;
                                    default:
                                        console.warn(msg, "Invalid keyboard '%s' button sent to facebook.", action.type);
                                        break;
                                }
                            });
                        }
                        else {
                            a.contentType = 'application/vnd.microsoft.card.hero';
                            attachments.push(a);
                        }
                        break;
                    default:
                        attachments.push(a);
                        break;
                }
            }
            msg.attachments = attachments;
        }
        moveFieldsTo(msg, msg, {
            'textLocale': 'locale',
            'sourceEvent': 'channelData'
        });
        delete msg.agent;
        delete msg.source;
        if (!msg.timestamp) {
            msg.timestamp = new Date().toISOString();
        }
    };

    prepIncomingMessage(msg) {
        moveFieldsTo(msg, msg, {
            'locale': 'textLocale',
            'channelData': 'sourceEvent'
        });
        msg.text = msg.text || '';
        msg.attachments = msg.attachments || [];
        msg.entities = msg.entities || [];
        var adds = {};
        moveFieldsTo(msg, adds, toAddress);
        var address = adds as builder.IAddress 
        msg.address = address;
        msg.source = address.channelId;
        if (msg.source == 'facebook' && msg.sourceEvent && msg.sourceEvent.message && msg.sourceEvent.message.quick_reply) {
            msg.text = msg.sourceEvent.message.quick_reply.payload;
        }
    };

    doRequest(options: request.OptionsWithUrl, callback: (e, r, b) => void) {
        request(options, function (err, response, body) {
            if (!err) {
                if (response.statusCode < 400) {
                    callback(null, response, body);
                }
                else {
                    var txt = options.method + " to '" + options.url + "' failed: [" + response.statusCode + "] " + response.statusMessage;
                    callback(new Error(txt), response, null);
                }
            } else {
                callback(err, null, null);
            }
        })
    }

    doPostMessage(msg: builder.IMessage, lastMsg: boolean, cb: (err: Error, address: any) => void, method?: string) {
        if (!method) { 
            method = 'POST'; 
        }
        this.prepOutgoingMessage(msg);
        var address = msg.address;
        msg['from'] = address.bot;
        msg['recipient'] = address.user;
        delete msg.address;

        if (msg.type === 'message' && !msg.inputHint) {
            msg.inputHint = lastMsg ? 'acceptingInput' : 'ignoringInput';
        }

        var path = joinPath(this.convPath, encodeURIComponent(address.conversation.id), '/activities');
 
        var options = {
            method: method,
            url: path,
            body: msg,
            json: true
        };

        this.doRequest(options, function (err, response, body) {
            if (!err) {
                if (body && body.id) {
                    var newAddress: any = clone(address)
                    newAddress.id = body.id
                    cb(null, newAddress);
                }
                else {
                    cb(null, address);
                }
            }
            else {
                cb(err, null);
            }
        });
    }


    onDispatchEvents(events, callback) {
        if (events && events.length > 0) {
            if (this.isInvoke(events[0])) {
                this.onInvokeHandler(events[0], callback);
            }
            else {
                this.onEventHandler(events);
                callback(null, null, 202);
            }
        }
    };

    dispatchEvent(msg, res, next) {
        try {
            this.prepIncomingMessage(msg);
            this.onDispatchEvents([msg], function (err, body, status) {
                if (err) {
                    res.status(500);
                    res.end();
                    next();
                    console.error('CustomChatConnector: error dispatching event(s) - ', err.message || '');
                }
                else if (body) {
                    res.send(status || 200, body);
                    res.end();
                    next();
                }
                else {
                    res.status(status || 200);
                    res.end();
                    next();
                }
            });
        }
        catch (e) {
            console.error(e instanceof Error ? e.stack : e.toString());
            res.status(500);
            res.end();
            next();
        }
    }

    onInvoke?(handler: (event: builder.IEvent, callback?: (err: Error, body: any, status?: number) => void) => void): void {
        this.onInvokeHandler = handler
    }
    
    onEvent(handler: (events: builder.IEvent[], callback?: (err: Error) => void) => void): void {
        this.onEventHandler = handler
    }
    
    /** Send message from bot to user */
    send(messages: builder.IMessage[], callback: (e: Error, addresses?: builder.IAddress[]) => void): void {
        var _this = this;
        var addresses = [];
        async.forEachOfSeries(messages, function (msg: builder.IMessage, idx, cb) {
            try {
                if (msg.type == 'delay') {
                    setTimeout(cb, msg.value);
                }
                else if (msg.address) {
                    _this.doPostMessage(msg, (idx == messages.length - 1), (err: Error, address: builder.IAddress[]) => {
                        addresses.push(address);
                        cb(err);
                    });
                }
                else {
                    console.error('ChatConnector: send - message is missing address or serviceUrl.');
                    cb(new Error('Message missing address or serviceUrl.'));
                }
            } catch (e) {
                cb(e);
            }
        }, (errCb: Error) => { callback(errCb, addresses) });

    }
    
    /** when the bot starts a conversation */
    startConversation(address: builder.IAddress, callback: (err: Error, address?: builder.IAddress) => void): void {
            if (address && address.user) {
                var options = {
                    method: 'POST',
                    url: this.convPath,
                    body: {
                        bot: { id: "servicedeskbot", name: "Service Desk" },
                        members: [address.user]
                    },
                    json: true
                };

                this.doRequest(options, function (err, response, body) {
                    var adr;
                    if (!err) {
                        try {
                            var obj = typeof body === 'string' ? JSON.parse(body) : body;
                            if (obj && obj.hasOwnProperty('id')) {
                                adr = clone(address);
                                adr.conversation = { id: obj['id'] };
                                if (obj['serviceUrl']) {
                                    adr.serviceUrl = obj['serviceUrl'];
                                }
                                if (adr.id) {
                                    delete adr.id;
                                }
                            }
                            else {
                                err = new Error('Failed to start conversation: no conversation ID returned.');
                            }
                        }
                        catch (e) {
                            err = e instanceof Error ? e : new Error(e.toString());
                        }
                    } else console.error('ChatConnector: startConversation - error starting conversation.');
                    
                    callback(err, adr);
                });
            }
            else {
                console.error('ChatConnector: startConversation - address is invalid.');
                callback(new Error('Invalid address.'));
            }
    }
        
    getData(context: builder.IBotStorageContext, callback: (err: Error, data: builder.IBotStorageData) => void): void {
        throw new Error("Method not implemented.");
    }
    
    saveData(context: builder.IBotStorageContext, data: builder.IBotStorageData, callback?: (err: Error) => void): void {
        throw new Error("Method not implemented.");
    }
}