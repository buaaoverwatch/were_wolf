export default{
    namespace: 'ALLROOM',
    state: {
        roomlist : [

        ],
        loading:false,
    },
    subscriptions: {
        //setup({ dispatch, history }) {
        //},
    },
    effects: {

    },
    reducers: {
        //这里应该没有reducers，基本都是从网上fetch吧大概
        hideloading(state){
            return {...state, loading: false};
        },
        showloading(state){
            return {...state, loading:true};
        },
        setRoomList(state,action){
            return {...state,action:roomlist.push({
                room_name:payload.room_name,
                room_id:payload.room_id,
                room_owner_nick:payload.owner_name
            })};
        }
    },
}