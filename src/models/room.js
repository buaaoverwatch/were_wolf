import StateConst from '../consts/roomstate';
import Toast from 'antd-mobile/lib/toast';

function delay(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

export default {

    namespace: 'room',

    state: {
        //登录->创建或加入->玩家列表->选座->设置->开始游戏
        client_id:'a2',
        nickname: '',
        username: "",
        //
        room_id: "1",
        room_name: '',
        owner_id: 'a2',
        //

        player_nick: {"a1": "lalal", "a2": "hahha", "a3": "ldldl", "a4": "ddddd"},
        player_avatar: {"a1": 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg', "a2": 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg', "a3": 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg', "a4": 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'},
        player_num: 4,
        player_id: ["a1", "a2", "a3", "a4"],
        //
        //
        index_player:{1:"",2:"",3:"",4:""},
        player_index: {"a1": 1, "a2": 2, "a3": 3, "a4": 4},//玩家选位之后
        //
        index_id: ["a1", "a2", "a3", "a4"],//所有玩家选位之后

        Werewolf:4,
        Villager:4,
        Cupid:1,
        Seer:1,
        Witch:1,
        Hunter:1,
        Guard:1,
        WolfWinCondition:1,
        //上面七个是设置游戏的时候，以及玩的时候

        player_role: {"a1":"witch", "a2":"wolf", "a3":"cupid", "a4": "seer",},//房主开始游戏之后
        player_alive: {"a1": true, "a2": true, "a3": true, "a4": true,},//房主开始游戏之后

        lover_id1:"",
        lover_id2:"",


        joinsheriff: ["a1", "a2"],//参与警长竞选名单
        lastwordlist: [],//需要留遗言玩家名单


        guess_role: {},
        player_wolfvote: {},//根据狼人投票列表渲染
        list_wolfvote: {"a1":"a3", "a2": "a4"},//狼人投票列表
        sheriff_id: "a4",
        sheriff_list:[],
        sheriff_modal:false,//警长弹框
        player_selectedid:"",
        player_selectedid2:"",
        player_selectedid_wolf:"",
        wolf_lastkill:"",//狼人杀死的人id-用来确认请求的
        last_wolf: "", //狼人确定杀死的人
        last_guard: "",//守卫守的人id
        last_witch_save: "",//女巫救的人id
        last_witch_kill: "",//女巫毒的人id
        wolf_msg:[],
        round: 1,
        curstate: StateConst.roomblock,
        laststate: StateConst.guard,

        room_request_id:'-1',
        user_request_id:0,

        lastvote: {"a1": 'a3', "a2":'a4', "a3":'a4', "a4": 'a4'},
        nextstep: false,
        witch_save:false,
        witch_kill:false,



        hassocket:false,
        socket:null,
        loading : false,
        myseat:0,
        //玩家选座的时候

        role_alive: true
    },

    subscriptions: {},

    effects: {
        *WebSocketsend({ payload }, { put, call }) {
            //const WebSocket = yield select(state => state.socket);
            yield put({ type: 'showLoading' });
            yield call(delay, 2000);
            yield put({ type: 'checkLoading' });
        },
        //TODO:当夜晚对应角色死亡时，加一个计时函数，计时结束时调用发送下一步请求
        *timerstate(_, { put, call }) {
            yield call(delay, 10000);
            yield put({ type: 'sendstate'});
        },
    },

    reducers: {
        //WebSocket相关
        addstate(state)//TODO:临时写的，方便测试，需要删
        {
            return {...state, curstate: state.curstate + 1};
        },

        showLoading(state) {
            return {...state, loading: true};
        },
        hideLoading(state) {
            return {...state, loading: false};
        },
        checkLoading(state) {
            if(state.loading==true)
                Toast.offline('网络连接失败,请重试',1);
            return {...state, loading: false};
        },
        setsocket(state,action)
        {
            return{...state,socket:action.payload,hassocket:true};
        },
        addUserRequestID(state)
        {
            return{...state,user_request_id:state.user_request_id+1};
        },
        setRoomRequestID(state,action)
        {
            return{...state,room_request_id:action.payload};
        },
        setWolfMsg(state,action)
        {
            let list = state.wolf_msg;
            list.push(action.payload);
            return{...state, wolf_msg:list};
        },
        setWolfVote(state,action)//设置狼人选人ID:ID对
        {
            let m={...state.list_wolfvote,[action.payload.wolf_id]:action.payload.object_id};
            let n={};
            for (let value of Object.values(m)) {
                let flag=false;
                for (let key of Object.keys(n))
                {
                    if(key==value)
                    {
                        n[key]++;
                        flag=true;
                    }
                }
                if(flag==false)
                {
                    n={...n,[value]:1};
                }
            }
            return{...state,list_wolfvote:m,player_wolfvote:n};
        },
        setLoverID(state,action)//TODO:在这里加情侣ID
        {
            console.log("in");
            console.log("lover1_id: " + msg.user1_id);
            console.log("lover2_id: " + msg.user2_id);
            return{...state,lover_id1:action.payload.lover_id1,lover_id2:action.payload.lover_id2};
        },

        changeselid(state,action)//这是点选Grid内内容后，切换当前选择玩家的reducer，丘比特因为要选两个人有特殊的判断
        {
            let selid1=state.player_selectedid;
            let selid2=state.player_selectedid2;
            if(state.curstate==StateConst.cupid)
            {
                if(state.player_selectedid2=="")
                    return{...state,player_selectedid2:action.payload};
                else if(state.player_selectedid=="")
                    return{...state,player_selectedid:action.payload};
                else if(action.payload==state.player_selectedid)
                    return{...state,player_selectedid:action.payload};
                else if(action.payload==state.player_selectedid2)
                    return{...state,player_selectedid2:action.payload};
                else
                    return{...state,player_selectedid2:action.payload,player_selectedid:selid2};
            }
            else
                return{...state,player_selectedid:action.payload};
        },
        changeselid_wolf(state)//这里是在狼人选人阶段，由于要利用通信，所以特殊处理
        {
            if(state.curstate==StateConst.wolf)
            {
                return{...state,player_selectedid:state.player_selectedid_wolf};
            }
            else
                return state;
        },
        setselid_wolf(state,action)//这里是在狼人选人阶段，暂存当前选人，等到服务器回复再调change处理
        {
            if(state.curstate==StateConst.wolf)
            {
                return{...state,player_selectedid_wolf:action.payload,player_selectedid:action.payload};
            }
            else
                return state;
        },
        setkillid_wolf(state,action)//这里是在狼人阶段，已经有狼人确认杀人以后，调用的reducer，目的是防止狼人杀不同的玩家
        {
            return{...state,wolf_lastkill:action.payload};
        },
        changeCharacterNum(state,action)
        {
            return {...state,};
        },
        setroomstate(state,action)
        {
            return{...state,curstate:action.payload};
        },
        setalive(state,action)
        {
            console.log('setalive');
            return{...state,player_alive:Object.assign(state.player_alive,action.payload)};
        },
        setsherifflist(state,action)
        {
            return{...state,sheriff_list:action.payload};
        },
        setlastvote(state,action)
        {
            return{...state,lastvote:action.payload};
        },
        setsheriff(state,action)
        {
            //TODO:如果old不是当前警长
            if(action.payload[state.sheriff_id]=='-1')
                return{...state,sheriff_id:''};
            else
                return{...state,sheriff_id:action.payload[state.sheriff_id]};
        },
        setsheriffmodal(state,action)
        {
            console.log("show_sheriff");
            return{...state,sheriff_modal:action.payload};
        },



        changeNextStep(state,action) {
            return { ...state, nextstep: action.payload};
        },
        changeWitchSave(state,action) {
            return { ...state, nextstep: action.payload};
        },
        changeWitchKill(state,action) {
            return { ...state, nextstep: action.payload};
        },


        //以下三个是change添加的，用于修改loading
        //用于修改player_index,用于修改myseat
        //当服务端返回为true时，ws会调用第二个reducer
        changeloading(state,action)
        {
            console.log("*****************" + action.payload);
            return {...state,loading:action.payload};
        },
        changeplayerindex(state)
        {
            return {  ... state,player_index:Object.assign(state.player_index,{client_id:state.myseat})};
        },
        changemyseat(state,action)
        {
            return {...state,myseat:action.payload};
        },
        //
        setwolf(state,action)
        {
            console.log("ok");
            return {...state,Werewolf:action.payload};
        },
        setvill(state,action)
        {
            return {...state,Villager:action.payload};
        },
        setcupido(state,action)
        {
            return {...state,Cupid:action.payload};
        },
        setseer(state,action)
        {
            return {...state,Seer:action.payload};
        },
        setwitch(state,action)
        {
            return {...state,Witch:action.payload};
        },
        sethunter(state,action)
        {
            return {...state,Hunter:action.payload};
        },
        setguard(state,action)
        {
            return {...state,Guard:action.payload};
        },
        setwincondition(state,action)
        {
            return {...state,WolfWinCondition:action.payload}
        },

        //qingchanghan
        setuserinfo(state, action) {
            console.log("id: " + action.payload.userID);
            console.log("name: " + action.payload.username);
            console.log('nickname: ' + action.payload.nickname);
            return { ...state, client_id: action.payload.userID, username: action.payload.username, nickname: action.payload.nickname};
        },
        createRoomSuccess(state, action) {
            let player_nick = {};
            player_nick[state.client_id] = state.nickname;
            return { ...state, room_id: action.payload.roomID, room_name: action.payload.roomName
                , owner_id: state.client_id, player_nick: player_nick};
        },
        addRoomSuccess(state, action) {
            return { ...state, room_id: action.payload.roomID, room_name: action.payload.roomName
                , owner_id: action.payload.ownerID};
        },
        setrolealive(state, action) {
            return { ...state, role_alive: action.payload};
        },
        setlastwolf(state, action) {
            return { ...state, last_wolf: action.payload};
        },
        setlastguard(state, action) {
            return { ...state, last_guard: action.payload};
        },
        setlastwitchsave(state, action) {
            return { ...state, last_witch_save: action.payload};
        },
        setlastwitchkill(state, action) {
            return { ...state, last_witch_kill: action.payload};
        },
        setjoinsheriff(state, action) {
            return { ...state, joinsheriff: action.payload};
        },
        updatealive(state) {
            let lastwordlist = [];
            let alive = state.player_alive;
            if(state.wolf_lastkill == state.last_guard || state.wolf_lastkill == state.last_witch_save) {
                console.log("狼人杀的人没有死");
            } else {
                alive[state.wolf_lastkill] = false;
                lastwordlist.push(state.wolf_lastkill);
                if(state.wolf_lastkill == state.lover_id1) {
                    alive[state.lover_id2] = false;
                    lastwordlist.push(state.lover_id2);
                } else if(state.wolf_lastkill == state.lover_id2) {
                    alive[state.lover_id1] = false;
                    lastwordlist.push(state.lover_id1);
                }
            }
            if(state.last_witch_kill != "") {
                if(lastwordlist.indexOf(state.last_witch_kill) == -1) {
                    lastwordlist.push(state.last_witch_kill);
                    alive[state.last_witch_kill] = false;
                }
                if(state.last_witch_kill == state.lover_id1) {
                    if(lastwordlist.indexOf(state.lover_id2) == -1) {
                        lastwordlist.push(state.lover_id2);
                        alive[state.lover_id2] = false;
                    }
                } else if(state.last_witch_kill == state.lover_id2) {
                    if(lastwordlist.indexOf(state.lover_id1) == -1) {
                        lastwordlist.push(state.lover_id1);
                        alive[state.lover_id1] = false;
                    }
                }
            }
            console.log('update alive');
            console.log(alive);
            return { ...state, last_witch_save: "", last_witch_kill: "",
                player_alive: alive, lastwordlist: lastwordlist};
        },
        sendstate(state) {
            if(state.hassocket) {
                let msg = JSON.stringify({
                    type: "4",
                    request_id: state.user_request_id,
                    room_id: state.props.room.room_id,
                    user_id: state.props.room.client_id
                });
                state.socket.send(msg);
            } else {
                console.log("websocket error!");
            }
        },
        joinroom(state, action) {
            let player_index = {};
            let index_player = {};
            let player_id = [];
            let i = 1;
            for(let key in action.payload) {
                player_id.push(key);
                index_player[i] = "";
                player_index[key] = null;
                i++;
            }
            console.log("room:");
            console.log(action.payload);
            return {...state, player_nick: action.payload, player_index: player_index,
                index_player: index_player, player_id: player_id, player_num: i - 1};
        },


        //已经写了修改角色列表的东西，and已经做了设置playindex的东西

        setrolelist(state,action){
            let list = {};
            for(let key in action.payload) {
                list[key] = true;
            }
            console.log('setrole alive');
            console.log(list);
            return {...state,player_role:action.payload, player_alive: list};
        },
        setplayerindex(state,action){
            let i = action.payload.u_id;
            let m = parseInt(action.payload.seat);
            let list = state.player_index;
            for(let key in list) {
                if(list[key] == '1')
                    continue;
                if(key == i) {
                    list[key] = null;
                }
            }
            list[i] = m;
            console.log('room.player_index:');
            console.log(list);
            return {...state,player_index:list};
        },
        playerindex2indexplayer(state,action){
            let i =action.payload.u_id;
            let m = action.payload.seat;
            let list = state.index_player;
            for(let key in list) {
                if(key == 1)
                    continue;
                if(list[key] == i) {
                    list[key] = "";
                }
            }
            list[m] = i;
            console.log('room.index_player:');
            console.log(list);
            return {...state,index_player:list};
        },
        set_index_id(state){
            let list = [];
            let list1= state.index_player;

            for(let i = 1;i<=state.player_num;i++)
            {
                list.push(list1[i]);
            }
            console.log("index-id");
            console.log(list);
            return {...state,index_id:list};
        },
    }

};/**
 * Created by shi on 2016/11/3.
 */
