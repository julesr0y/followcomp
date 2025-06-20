(async () => {
    const username = window.location.pathname.split('/')[1];
    let followers = [];
    let followings = [];
    let dontFollowMeBack = [];
    let iDontFollowBack = [];

    try {
        const userQueryRes = await fetch(
            `https://www.instagram.com/web/search/topsearch/?query=${username}`
        );

        const userQueryJson = await userQueryRes.json();
        const userId = userQueryJson.users.map(u => u.user)
            .filter(u => u.username === username)[0]?.pk;

        if (!userId) {
            console.error("User ID not found. Ensure you're on a profile page.");
            return;
        }

        let after = null;
        let has_next = true;

        // Fetch followers
        while (has_next) {
            const res = await fetch(
                `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
                encodeURIComponent(
                    JSON.stringify({
                        id: userId,
                        include_reel: true,
                        fetch_mutual: true,
                        first: 50,
                        after: after,
                    })
                )
            );

            const json = await res.json();
            has_next = json.data.user.edge_followed_by.page_info.has_next_page;
            after = json.data.user.edge_followed_by.page_info.end_cursor;
            followers = followers.concat(
                json.data.user.edge_followed_by.edges.map(({ node }) => ({
                    username: node.username,
                    full_name: node.full_name,
                    is_verified: node.is_verified,
                    profile_pic_url: node.profile_pic_url
                }))
            );
        }

        // Fetch followings
        after = null;
        has_next = true;

        while (has_next) {
            const res = await fetch(
                `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
                encodeURIComponent(
                    JSON.stringify({
                        id: userId,
                        include_reel: true,
                        fetch_mutual: true,
                        first: 50,
                        after: after,
                    })
                )
            );

            const json = await res.json();
            has_next = json.data.user.edge_follow.page_info.has_next_page;
            after = json.data.user.edge_follow.page_info.end_cursor;
            followings = followings.concat(
                json.data.user.edge_follow.edges.map(({ node }) => ({
                    username: node.username,
                    full_name: node.full_name,
                    is_verified: node.is_verified,
                    profile_pic_url: node.profile_pic_url
                }))
            );
        }

        // Compare followers and followings
        dontFollowMeBack = followings.filter((following) => {
            return !followers.find((follower) => follower.username === following.username);
        });

        console.log({ dontFollowMeBack });
        chrome.runtime.sendMessage({
            action: "setDontFollowMeBack",
            data: dontFollowMeBack
        }); // Save to storage (popup.js will handle this)

        iDontFollowBack = followers.filter((follower) => {
            return !followings.find((following) => following.username === follower.username);
        });

        console.log({ iDontFollowBack });
    } catch (err) {
        console.error("Error:", err);
    }
})();