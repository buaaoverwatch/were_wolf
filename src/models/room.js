import StateConst from '../consts/roomstate';
export default {

    namespace: 'room',

    state: {
        //登录->创建或加入->玩家列表->选座->设置->开始游戏
        client_id:'a3',
        //
        room_id: null,
        room_name: '',
        owner_id: '213',
        //
        index_player:{0:this.owner_id,1:"null",2:"asdsa",3:"asss"},
        player_nick: {"a1": "lalal", "a2": "hahha", "a3": "ldldl", "a4": "ddddd"},
        player_avatar: {},
        player_num: 10,
        player_id: ["a1", "a2", "a3", "a4"],
        //
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

        player_role: {"a1":"witch", "a2":"wolf", "a3":"cupid", "a4": "hunter",},//房主开始游戏之后
        player_alive: {"a1": true, "a2": true, "a3": true, "a4": true,},//房主开始游戏之后





        guess_role: {},
        player_wolfvote: {"a1": 0, "a2": 0, "a3": 1, "a4": 2},
        sheriff_id: "a4",
        sheriff_list:[],
        player_selectedid:"",
        player_selectedid2:"",
        wolf_lastkill:"",
        round: 1,
        curstate: StateConst.cupid,

        room_request_id:0,
        user_request_id:0,

        lastvote: {},
        nextstep: false,
        witch_save:false,
        witch_kill:false,



        hassocket:false,
        socket:null,
        loading : false,
        myseat:0,
        //玩家选座的时候
    },

    subscriptions: {},

    effects: {

    },

    reducers: {
        //WebSocket相关
        showLoading(state) {
            return {...state, loading: true};
        },
        setsocket(state,action)
        {
            return{...state,socket:action.payload,hassocket:true};
        },
        addUserRequestID(state)
        {
            let i=state.user_request_id+1;
            return{...state,user_request_id:i};
        },
        setRoomRequestID(state,action)
        {
            return{...state,room_request_id:action.payload};
        },

        changeselid(state,action)
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
            return{...state,player_alive:Object.assign(this.player_alive,action.payload)};
        },
        setsherifflist(state,action)
        {
            return{...state,sherifflist:action.payload};
        },
        setalastvote(state,action)
        {
            return{...state,lastvote:action.payload};
        },
        setsheriff(state,action)
        {
            return{...state,sheriff_id:action.payload};
        },



        changeNextStep(state) {
            return { ...state, nextstep: !state.nextstep};
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
        changechooseseatloading(state,action)
        {
            return {...state,loading:action.payload};
        },
        changeplayerindex(state)
        {
            return {  ... state,player_index:Object.assign(this.player_index,{client_id:this.myseat})};
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
        }
    }

};/**
 * Created by shi on 2016/11/3.
 */
