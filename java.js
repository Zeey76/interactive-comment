let commentsData = {};
async function fetchData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Failed to fetch advice");

    commentsData = await response.json();
    commentMessages(commentsData);
  } catch (error) {
    console.error("Error fetching data");
  }
}

let count;
let username;
function commentMessages(comments) {
  count = 0;
  const commentsContainer = document.querySelector(".comments");

  commentsContainer.innerHTML = "";
  comments.comments.forEach((comment) => {
    count++;
    comment.id = count;
    const replies = comment.replies;
    console.log(replies);
    commentsContainer.innerHTML += `
            
        <div class="comment flex flex-col gap-4  rounded-lg" id="comment-${comment.id}">
          <div class="commentt w-full flex items-start gap-4 bg-white rounded-lg p-5 relative">
          <div
            class="score bg-Light-gray flex flex-col items-center justify-center gap-3 rounded-lg px-2 py-3"
          >
            <img src="./images/icon-plus.svg" />
            <p>${comment.score}</p>
            <img src="./images/icon-minus.svg" />
          </div>
          <div class="comment-message flex flex-col gap-2 w-full">
            <div class="flex gap-4 items-center">
              <img src="${comment.user.image.webp}" class="w-9">
              <p>${comment.user.username}</p>
              <p>${comment.createdAt}</p>
              <div class="comment-actions ml-auto">
                ${
                  comment.user.username === comments.currentUser.username
                    ? `<div class="flex gap-3 items-end">
                    <button class="delete-button flex items-center gap-2" onclick="deleteComment(${comment.id})"><img src="./images/icon-delete.svg" class="w-4 h-4" ><p>Delete</p></button>
                    <button class="edit-button flex items-center gap-2" onclick="editComment(${comment.id}, \`${comment.content}\`)"><img src="./images/icon-edit.svg" class="w-4 h-4"><p>Edit</p></button>
                  </div>`
                    : `<button class="flex items-center gap-2 ml-auto" onclick="showReplyBox(${comment.id})"><img src="./images/icon-reply.svg" class="w-4 h-4"><p>Reply</p></button>`
                }
              </div>
              
            </div>
            <div class="comment-container">
             <p class="comment-content break-words whitespace-pre-wrap">${comment.content}</p>
            </div>
          </div>
          </div>
        </div>
        
            `;
    replies.forEach((reply) => {
      count++;
      reply.id = count;
      commentsContainer.innerHTML += `
                <div class="replies ml-auto flex flex-col gap-4" id="reply-${reply.id}">
                <div class="reply w-full flex items-start gap-4 bg-white p-5 rounded-lg relative">
          <div
            class="score bg-Light-gray flex flex-col items-center justify-center gap-3 rounded-lg px-2 py-3"
          >
            <img src="./images/icon-plus.svg" />
            <p>${reply.score}</p>
            <img src="./images/icon-minus.svg" />
          </div>
          <div class="comment-message flex flex-col gap-2 w-full">
            <div class="flex gap-4 items-center">
              <img src="${reply.user.image.webp}" class="w-9">
              <p>${reply.user.username}</p>
              <p>${reply.createdAt}</p>
              <div class="comment-actions ml-auto">
                ${
                  reply.user.username === comments.currentUser.username
                    ? `<div class="flex gap-3 items-end">
                    <button class="delete-button flex items-center gap-2" onclick="deleteReply(${comment.id}, ${reply.id})"><img src="./images/icon-delete.svg" class="w-4 h-4"><p>Delete</p></button>
                    <button class="edit-button flex items-center gap-2" onclick="editReply(${comment.id}, ${reply.id}, \`${reply.content}\`)"><img src="./images/icon-edit.svg" class="w-4 h-4"><p>Edit</p></button>
                  </div>`
                    : `<button class="flex items-center gap-2 ml-auto" onclick="showReplyBox(${comment.id}, ${reply.id})"><img src="./images/icon-reply.svg" class="w-4 h-4"><p>Reply</p></button>`
                }
              </div>
            </div>
            <div class="reply-container">
            <p class="break-words whitespace-pre-wrap"><span class="reply-username text-Moderate-blue font-bold">@${reply.replyingTo}</span> ${reply.content}</p>
            </div>
          </div>
        </div>
        </div>
        
            `;
    });
    console.log(commentsContainer);
  });
}

const addNewComment = () => {
  const newCommentInput = document.querySelector(".new-comment");
  if (!newCommentInput.value.trim()) {
    alert("Comment cant be empty");
    return;
  }
  const newComment = {
    id: count++,
    content: newCommentInput.value,
    createdAt: new Date(),
    score: 0,
    user: commentsData.currentUser,
    replies: [],
  };
  commentsData.comments.push(newComment);
  newCommentInput.value = "";
  updateTime(newComment)
  commentMessages(commentsData);
};

const showReplyBox = (commentId, replyId = null) => {
  // Remove any existing edit textarea or reply box
  const existingEditBox = document.querySelector(".edit-textarea");
  if (existingEditBox) {
    commentMessages(commentsData)
  }
  const existingReplyBox = document.querySelector(".reply-box");
  if (existingReplyBox) {
    existingReplyBox.remove();
  }

  const targetDiv = replyId
    ? document.querySelector(`#reply-${replyId}`)
    : document.querySelector(`#comment-${commentId}`);

  const replyBox = `
    <div class="reply-box flex items-start gap-3 rounded-lg bg-white p-5">
          <img src="./images/avatars/image-juliusomo.png" class="h-9 w-9" />
          <textarea
            class="new-reply h-24 w-full resize-none overflow-y-auto rounded-lg border border-gray-300 p-2"
            placeholder="Add a reply..."
          ></textarea>
          <button
            class="send-button rounded bg-Moderate-blue px-4 py-2 font-bold uppercase text-white" onclick="addReply(${commentId}, ${replyId})"
          >
            Reply
          </button>
        </div>
  `;
  targetDiv.innerHTML += replyBox;
};

const editComment = (commentId, commentContent) => {
  // Remove any existing edit textarea or reply box
  const existingEditBox = document.querySelector(".edit-textarea");
  if (existingEditBox) {
    commentMessages(commentsData)
  }
  const existingReplyBox = document.querySelector(".reply-box");
  if (existingReplyBox) {
    existingReplyBox.remove();
  }

  const commentContainer = document.querySelector(
    `#comment-${commentId} .comment-container`,
  );

  const textarea = document.createElement("textarea");
  textarea.className =
    "edit-textarea w-full resize-none overflow-y-auto rounded-lg border border-gray-300 p-2";
  textarea.value = commentContent;
  textarea.originalContent = commentContent;

  const updateButton = document.createElement("button");
  updateButton.className =
    "update-button rounded bg-Moderate-blue px-4 py-2 font-bold uppercase text-white";
  updateButton.textContent = "Update";

  commentContainer.innerHTML = "";
  commentContainer.appendChild(textarea);
  commentContainer.appendChild(updateButton);

  updateButton.addEventListener("click", () => {
    const updatedText = textarea.value;
    const comment = commentsData.comments.find((c) => c.id === commentId);
    if (comment) {
      comment.content = updatedText;
      commentMessages(commentsData);
    }
  });
};

const editReply = (commentId, replyId, replyContent) => {
  // Remove any existing edit textarea or reply box
  const existingEditBox = document.querySelector(".edit-textarea");
  if (existingEditBox) {
    commentMessages(commentsData)
  }
  const existingReplyBox = document.querySelector(".reply-box");
  if (existingReplyBox) {
    existingReplyBox.remove();
  }

  const replyContainer = document.querySelector(
    `#reply-${replyId} .reply-container`,
  );

  const textarea = document.createElement("textarea");
  textarea.className =
    "edit-textarea w-full resize-none overflow-y-auto rounded-lg border border-gray-300 p-2";
  textarea.value = replyContent;
  textarea.originalContent = replyContent;

  const updateButton = document.createElement("button");
  updateButton.className =
    "update-button rounded bg-Moderate-blue px-4 py-2 font-bold uppercase text-white";
  updateButton.textContent = "Update";

  replyContainer.innerHTML = "";
  replyContainer.appendChild(textarea);
  replyContainer.appendChild(updateButton);

  updateButton.addEventListener("click", () => {
    const updatedText = textarea.value;
    const comment = commentsData.comments.find((c) => c.id === commentId);
    if (comment) {
      const reply = comment.replies.find((r) => r.id === replyId);
      reply.content = updatedText;
      commentMessages(commentsData);
    }
  });
};

const addReply = (commentId, replyId = null) => {
  const replyInput = document.querySelector(".new-reply");
  if (!replyInput.value.trim()) {
    alert("Reply can't be empty");
    return;
  }

  const comment = commentsData.comments.find(
    (comment) => comment.id === commentId,
  )

  if (comment) {
    let username = "";
    if (replyId) {
      const reply = comment.replies.find((reply) => reply.id === replyId)
      if (reply) {
        username = reply.user.username
      }
    } else {
      username = comment.user.username 
    }


    const newReply = {
      id: comment.id,
      content: replyInput.value,
      createdAt: new Date(),
      score: 0,
      replyingTo: username,
      user: {
        image: {
          png: "./images/avatars/image-juliusomo.png",
          webp: "./images/avatars/image-juliusomo.webp",
        },
        username: "juliusomo",
      }
    };

    if (replyId) {
      const parentReplyIndex = comment.replies.findIndex((reply) => reply.id === replyId);
      if (parentReplyIndex !== -1) {
        comment.replies.splice(parentReplyIndex + 1, 0, newReply);
      }
    } else {
      comment.replies.push(newReply)
    }
    updateTime(newReply)
    commentMessages(commentsData);
  }
};

const deleteComment = (commentId) => {
  const comment = commentsData.comments;
  const commentIndex = comment.findIndex((comment) => comment.id === commentId);
  if (commentIndex !== -1) {
    comment.splice(commentIndex, 1);
    commentMessages(commentsData);
  }
};

const deleteReply = (commentId, replyId) => {
  const comments = commentsData.comments;
  const comment = comments.findIndex((comment) => comment.id === commentId);
  if (comment !== -1) {
    const replyIndex = comments[comment].replies.findIndex(
      (reply) => reply.id === replyId,
    );
    if (replyIndex !== -1) {
      console.log(replyIndex);
      comments[comment].replies.splice(replyIndex, 1);
      commentMessages(commentsData);
    }
  }
};

const sendButton = document.querySelector(".send-button");
sendButton.addEventListener("click", addNewComment);

function updateTime (reply) {
  const update = setInterval(() => {
    const now = new Date();
    const createdAtDate = new Date(reply.createdAt);
    const timeDifference = now - createdAtDate;
    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);

    let timesAgo = "";
    if (secondsAgo < 60) {
      timesAgo = `${secondsAgo} second${secondsAgo > 1 ? "s" : ""} ago`;
    } else if (minutesAgo < 60) {
      timesAgo = `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
    } else if (hoursAgo < 24) {
      timesAgo = `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    } else {
      const daysAgo = Math.floor(hoursAgo / 24);
      timesAgo = `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`
    }
    reply.createdAt = timesAgo;
    commentMessages(commentsData)
    if (hoursAgo >= 24) {
      clearInterval(update)
    }
  }, 1000)
}
fetchData();
