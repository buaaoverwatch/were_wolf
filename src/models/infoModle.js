/**
 * Created by Qingchang Han on 2016/10/30.
 */
export default{
    namespace: 'information',
    state: {
        userID: "1230321",
        ifLogin: false,
        username: "qingchanghan",
        nickname: "嘟嘟",
        password: "123456",
        introduce: "coding......",
        friendList: [],
        recordList: [
            {
                id: "记录一",
                type: "狼人",
                result: "victory",
                time: "2016/11/2"
            },
            {
                id: "记录二",
                type: "预言家",
                result: "defeat",
                time: "2016/11/1"
            }
        ],
        loading: false,
        roomID: "8501",
        roomName: "",
        ownerID: "",
        roomMembers: [
            "测试一号玩家",
            "测试二号玩家",
            "测试三号玩家",
            "测试四号玩家",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12"
        ],
        ifOwner: false
    },
    subscriptions: {
        setup({ dispatch, history }) {
        },
    },
    effects: {
        // *createRoom(_, { call, put }) {
        //     yield call(delay, 1000);
            // yield put({
            //    type: 'changeRoomID',
            //     payload: "8501"
            // });
            // yield put({
            //     type: 'createRoomSuccess'
            // });
        // },
        // *addRoom(payload, {call, put }) {
        //     yield call(delay, 1000);
        //     // yield put({
        //     //     type: 'changeRoomID',
        //     //     payload: payload
        //     // });
        //     yield put({
        //         type: 'createRoomSuccess'
        //     });
        // }
    },
    reducers: {
        registerSuccess(state, action) {
          return { ...state, username: action.payload.username, nickname: action.payload.nickname
              , password: action.payload.password, introduce: action.payload.introduce
                , userID: action.payload.userID};
        },
        loginSuccess(state, action) {
          return { ...state, username: action.payload.username, nickname: action.payload.nickname
              , password: action.payload.password, introduce: action.payload.introduce
                , userID: action.payload.userID};
        },
        editSuccess(state, action) {
            return { ...state, nickname: action.payload.nickname,
                password: action.payload.password, introduce: action.payload.introduce};
        },
        loadingTrue(state) {
            return { ...state, loading: true};
        },
        loadingFalse(state) {
            return { ...state, loading: false};
        },
        changeLoading(state) {
            return { ...state, loading: !state.loading};
        },
        createRoomSuccess(state, action) {
            return { ...state, roomID: action.payload.roomID, roomName: action.payload.roomName
                    , ownerID: action.payload.ownerID};
        },
        addRoomSuccess(state, action) {
            return { ...state, roomID: action.payload.roomID, roomName: action.payload.roomName
                    , ownerID: action.payload.ownerID};
        },
        changeRoomID(state, action) {
            return { ...state, roomID: action.payload};
        },
        changeMember(state) {
            let list = state.roomMembers;
            list.push("12");
            return { ...state, roomMembers: list};
        }
    },
}