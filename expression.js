const { gql, request } = require('graphql-request');

/* GQL Query for box A
{
    userA(id: ${ [UserAddress] }) {
        id,
        box,
        lpHolding,
        updatedAt,
        lpMinThisWeek
    }
}
*/

function expressionA(gqlResp) {
    gqlResp = gqlResp.userA;
    if (!gqlResp) return 0;
    const startWeek = 2695;
    function getNumWeek(l, r) { 
        if (l < startWeek) l = startWeek;
        if (l > r) return 0;
        return r - l + 1;
    }
    const amountX = 400;
    const amountY = 1600;

    let week = 86400 * 7;
    let box = gqlResp.box;
    let updatedWeek = Math.floor(parseFloat(gqlResp.updatedAt) / week);
    let thisWeek = Math.floor(Date.now() / 1000 / week);

    if (thisWeek > updatedWeek) {
        if (parseFloat(gqlResp.lpHolding) >= amountX) {
            box += getNumWeek(updatedWeek + 1, thisWeek - 1);
        }
        if (parseFloat(gqlResp.lpHolding) >= amountY) {
            box += getNumWeek(updatedWeek + 1, thisWeek - 1);
        }
        if (parseFloat(gqlResp.lpMinThisWeek) >= amountX) {
            box += getNumWeek(updatedWeek, updatedWeek);
        }
        if (parseFloat(gqlResp.lpMinThisWeek) >= amountY) {
            box += getNumWeek(updatedWeek, updatedWeek);
        }
    }
    return box;
}

/* GQL Query for box B
{
    userB(id: ${ [UserAddress] }) {
        id,
        box,
        lpHolding,
        updatedAt,
        lpMinToday
    }
}
*/

function expressionB(gqlResp) {
    gqlResp = gqlResp.userB;
    if (!gqlResp) return 0;

    const startDay = 18865;
    function getNumDay(l, r) { 
        if (l < startDay) l = startDay;
        if (l > r) return 0;
        return r - l + 1;
    }
    const amountY = 1600;

    let day = 86400;
    let box = gqlResp.box;
    let updatedDay = Math.floor(parseFloat(gqlResp.updatedAt) / day);
    let today = Math.floor(Date.now() / 1000 / day);

    if (today > updatedDay) {
        if (parseFloat(gqlResp.lpHolding) >= amountY) {
            box += getNumDay(updatedDay + 1, today - 1);
        }
        if (parseFloat(gqlResp.lpMinToday) >= amountY) {
            box += getNumDay(updatedDay, updatedDay);
        }
    }
    return box;
}


async function main() {
    const userAddress = "0xffc21269d65cc460978c7b9e3474c7d831ee3cbb";
    const url = "https://api.thegraph.com/subgraphs/name/ngfam/pendle-nft2";
    let gqlResp = await request(url, gql`
        {
            userB(id: \"${userAddress}\") {
                id,
                box,
                lpHolding,
                updatedAt,
                lpMinToday
            }
        }
    `);

    console.log(expressionB(gqlResp));
}

main();