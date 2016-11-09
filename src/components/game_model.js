export default{
    namespace: 'setting_page',
    state: {
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