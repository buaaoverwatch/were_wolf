export default{
    namespace: 'change',
    state: {
        roomlist1 : [  
            {
                room_name : '傻逼的房间',
                room_id : '23323',
                room_holder : '青河',
                nights : '5'
            },
            {
                room_name : '傻逼叶清河的房间',
                room_id : '2333',
                room_holder : '叶青河',
                nights : '5'
            },
        ],
         game_setting: {
            Werewolf:4,
            Villager:4,
            Cupido:1,
            Seer:1,
            Witch:1,
            Hunter:1,
            Guard:1,
            WolfWinCondition:1

        },
    },
    subscriptions: {
        //setup({ dispatch, history }) {
        //},
    },
    effects: {

    },
    reducers: {
        //这里应该没有reducers，基本都是从网上fetch吧大概
    },
}