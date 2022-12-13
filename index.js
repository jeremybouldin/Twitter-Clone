import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    } else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    } else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    } else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } else if(e.target.dataset.replyInputBtn){
        handleReplyInputBtnClick(e.target.dataset.replyInputBtn)
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
    if (!targetTweetObj.isRetweeted){
        targetTweetObj.retweets ++
    } else {
        targetTweetObj.retweets --
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    renderTweets()
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: '@jbouldin87',
            profilePic: 'images/scrimbalogo.png',
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        tweetInput.value = ''
        renderTweets()
    }
}

function handleReplyInputBtnClick(tweetId){
    const replyInput = document.getElementById('text-input-'+tweetId)

    
    if(replyInput.value){
        const targetTweet = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]

        targetTweet.replies.unshift({
            handle: '@jbouldin87',
            profilePic: 'images/scrimbalogo.png',
            tweetText: replyInput.value
        })
        replyInput.value = ''
        renderTweets()
    }
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

        let repliesHtml = `
            <div class="reply-input-area">
                <textarea
                    placeholder="Tweet your reply!"
                    class="reply-input"
                    id="text-input-${tweet.uuid}"
                ></textarea>
                <button 
                    id="reply-input-btn"
                    data-reply-input-btn="${tweet.uuid}"
                >Reply</button>
            </div>
        `

        if (tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                `
            })
        
        
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
            <div id="replies-${tweet.uuid}">
                <!-- replies here -->
                ${repliesHtml}
            </div>
        </div>
        `
    })
    return feedHtml
}

function renderTweets(){
    document.getElementById('feed').innerHTML = getFeedHtml(tweetsData)
}

renderTweets()

