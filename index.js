import { tweetsData } from "./data.js";
const tweetInput = document.getElementById('tweet-input')
const tweetBtn = document.getElementById('tweet-btn')
const feedArea = document.getElementById('feed')

tweetBtn.addEventListener('click', function(){
    console.log(tweetInput.value)
})

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
})

//myVersion
// function handleLikeClick(tweetId){
//     tweetsData.forEach(function(tweet){
//         if(tweet.uuid === tweetId){
//             const targetTweetObj = tweet
//         }
//         if(tweet.uuid === tweetId && !tweet.isLiked){
//             tweet.likes ++
//             tweet.isLiked = true
//         } else if (tweet.uuid === tweetId && tweet.isLiked){
//             tweet.likes --
//             tweet.isLiked = false
//         }
//     })
//     renderTweets()
// }

//scrimbaVersion
function handleLikeClick(tweetId){
    //filter tweetsData array to find object with matching uuid
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    //Increment, decrement, flip boolean
    if(!targetTweetObj.isLiked){
        targetTweetObj.likes ++
    } else {
        targetTweetObj.likes --
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    renderTweets()
}

function handleRetweetClick(tweetId){
    //filter tweetsData array to find object with matching uuid
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    //Increment, decrement, flip boolean
    if(!targetTweetObj.isRetweeted){
        targetTweetObj.retweets ++
    } else {
        targetTweetObj.retweets --
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    renderTweets()
}

function getFeedHtml(tweets) {
    let feedHtml = ''
    tweets.forEach(function(tweet){
        let likeIconClass = ''
        let retweetIconClass = ''

        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        if (tweet.replies.length > 0){
            console.log(tweet.uuid)
        }

        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" 
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}" 
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}" 
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
        </div>
        `
    })
    return feedHtml
}

function renderTweets(){
    feedArea.innerHTML = getFeedHtml(tweetsData)
}

renderTweets()

