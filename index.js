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
    } else if(e.target.dataset.tweetDelete){
        handleDeleteTweetBtnClick(e.target.dataset.tweetDelete)
    } else if(e.target.dataset.replyDelete){
        handleDeleteReplyBtnClick(e.target.dataset.replyDelete, e.target.dataset.tweetParent)
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

    if(tweetInput.value.trim()){
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
    
    if(replyInput.value.trim()){
        const targetTweet = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]

        targetTweet.replies.unshift({
            handle: '@jbouldin87',
            profilePic: 'images/scrimbalogo.png',
            tweetText: replyInput.value,
            uuid: uuidv4()
        })
        replyInput.value = ''
        renderTweets()
    }
}

//Check the UUID of the tweet and delete
function handleDeleteTweetBtnClick(tweetId){
    const targetTweet = tweetsData.filter(tweet => tweet.uuid !== tweetId)
    // const targetTweet = tweetsData.filter(function(tweet, index, arr){
    //     if (tweet.uuid === tweetId){
    //         arr.splice(index, 1)
    //         return true
    //     }
    //     return false
    // })
    renderTweets(targetTweet)
}

//Filter the array of tweets
//Check the UUID of the reply and delete
function handleDeleteReplyBtnClick(replyId, tweetId){

    const parentTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    const replyIndex = parentTweet.replies.filter(reply => reply.uuid !== replyId)
    // const replyIndex = parentTweet.replies.filter(function(reply, index, arr){
    //     if (reply.uuid === replyId){
    //         arr.splice(index, 1)
    //         return true
    //     }
    //     return false
    // })
    // renderTweets(tweetsData)
    parentTweet.replies = replyIndex
    renderTweets()
}

function getFeedHtml(tweets) {
    let feedHtml = ''
    tweets.forEach(function(tweet){

        const likeIconClass = tweet.isLiked ? 'liked' : ''
        const retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''

        //REPLIES
        //Add in the reply textarea at the start of the replies section
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
        //Next loop through each reply and add the initial HTML
        if (tweet.replies){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                `

                //Check if user's reply. If so, add a delete button
                if(reply.handle === '@jbouldin87'){
                    repliesHtml += `
                        <div> 
                            <div class="delete delete-reply">
                                <p class="handle">${reply.handle}</p>
                <!-- added a reply id and parent tweet id to data-->
                                <i 
                                class="fa-solid fa-trash-can"
                                data-reply-delete="${reply.uuid}"
                                data-tweet-parent="${tweet.uuid}"
                                ></i>
                            </div>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                    `

                //If not user's post, add normal HTML
                } else {
                    repliesHtml += `
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                    `
                }
            })
        }

        //TWEETS
        //Start with initial HTML all tweets get regardless of author
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
        `
        
        //Define html to be used if author's own post (add trash can if yes)
        const authorsOwnPost = `
                <div class="delete delete-tweet">
                    <p class="handle">${tweet.handle}</p>
                    <i class="fa-solid fa-trash-can"
                    data-tweet-delete="${tweet.uuid}"
                    ></i>
                </div>
        `
        const notAuthorsOwnPost = `
                <p class="handle">${tweet.handle}</p>
        `

        //Add in the rest of the tweet detail HTML
        feedHtml += `
            ${tweet.handle === '@jbouldin87' ? authorsOwnPost : notAuthorsOwnPost}
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

function renderTweets(data){
    document.getElementById('feed').innerHTML = getFeedHtml(data || tweetsData)
}

renderTweets()

