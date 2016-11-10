export default {

    namespace: 'room',

    state: {
        room_id: null,
        room_name: '',
        owner_id: '',
        player_num: null,
        player_id: [],
        player_index: {},
        index_id: ["a1", "a2", "a3", "a4"],
        player_nick: {"a1": "lalal", "a2": "hahha", "a3": "ldldl", "a4": "ddddd"},
        guess_role: {},
        player_role: {},
        player_avatar: {},
        player_alive: {"a1": true, "a2": true, "a3": true, "a4": true,},
        player_wolfvote: {"a1": 0, "a2": 0, "a3": 1, "a4": 2},
        sheriff_id: "a4",
        player_selectedid:"",
        round: null,
        curstate: '',
        lastvote: {},
    },

    subscriptions: {},

    effects: {},

    reducers: {
        showLoading(state) {
            return {...state, loading: true};
        },
        changeselid(state,action)
        {
            return{...state,player_selectedid:action.payload};
        }

    }

};/**
 * Created by shi on 2016/11/3.
 */
