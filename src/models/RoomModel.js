export default{
    namespace: 'ALLROOM',
    state: {
        roomlist : [

        ],
        loading:false,
        refreshing:false,
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
        hiderefreshing(state){
            return {...state, refreshing: false};
        },
        showrefreshing(state){
            return {...state, refreshing:true};
        },
        setRoomList(state,action){
            let list = action.payload;
            console.log(action.payload);
            return {...state,roomlist:list};
        }
    },
}