/**
 * Created by Qingchang Han on 2016/11/7.
 */
function convert(users) {
    let list = [], giveup = [];
    let i, j;
    //读入
    for(i = 0; i < users.length; i++) {
        if(!users[i].vote) {
            giveup.push(users[i].key);
        }
        for(j = 0; j < list.length; j++) {
            if(list[j].vote == users[i].vote) {
                break;
            }
        }
        if(j == list.length) {
            list.push({
                vote: users[i].vote,
                key:[
                    users[i].key,
                ],
            });
        } else {
            list[j].key.push(users[i].key);
        }
    }
    //排序
    list.sort(function (a, b) {
        return a.vote-b.vote;
    });
    giveup.sort();
}