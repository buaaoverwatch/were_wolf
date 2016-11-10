export default {

    namespace: 'room',

    state: {
        room_id: null,
        room_name: '',
        client_id:'a4',
        owner_id: '',
        player_num: 10,
        player_id: [],
        player_index: {},
        index_id: ["a1", "a2", "a3", "a4"],
        player_nick: {"a1": "lalal", "a2": "hahha", "a3": "ldldl", "a4": "ddddd"},
        guess_role: {},
        player_role: {"a1":"witch", "a2":"wolf", "a3":"villager", "a4": "hunter",},
        player_avatar: {},
        player_alive: {"a1": true, "a2": true, "a3": true, "a4": true,},
        player_wolfvote: {"a1": 0, "a2": 0, "a3": 1, "a4": 2},
        sheriff_id: "a4",
        sheriff_list:[],
        player_selectedid:"",
        round: null,
        curstate: '',
        request_id:0,
        lastvote: {},

        Werewolf:4,
        Villager:4,
        Cupido:1,
        Seer:1,
        Witch:1,
        Hunter:1,
        Guard:1,
        WolfWinCondition:1,



        socket:null,
        loading : false,
        myseat:0,
    },

    subscriptions: {},

    effects: {

    },

    reducers: {
        showLoading(state) {
            return {...state, loading: true};
        },
        changeselid(state,action)
        {
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
        setsocket(state,action)
        {
            return{...state,socket:action.payload};
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
            return {...state,Cupido:action.payload};
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

    }

};/**
 * Created by shi on 2016/11/3.
 */
