export default {

    namespace: 'room',

    state: {
        room_id:null,
        room_name:'',
        owner_id:'',
        player_num:null,
        player_id:[],
        player_index:{},
        index_id:[],
        player_nick:{},
        guess_role:{},
        player_role:{},
        player_avatar:{},
        player_alive:{},
        player_selected:{},
        sheriff_id:'',
        round:null,
        state:'',
        lastvote:{},
    },

    subscriptions: {

    },

    effects: {

    },

    reducers: {
        showLoading(state) {
            return { ...state, loading: true };
        },

    },

};/**
 * Created by shi on 2016/11/3.
 */
