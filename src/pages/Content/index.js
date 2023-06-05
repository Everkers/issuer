import { renderUI } from './modules/renderer';
const extractCommentId = (commentNode) => {
  const commentId = commentNode
    .querySelector('.js-comment-container .timeline-comment-group')
    ?.getAttribute('id');
  return commentId ? commentId : '';
};

window.addEventListener('load', () => {
  const commentsParentNodes = document.querySelectorAll('.js-timeline-item');
  let formatedComments = [];

  commentsParentNodes.forEach((node) => {
    const emojis = node.querySelectorAll('.social-reaction-summary-item');
    if (!emojis) return;

    const formatedEmojis = Array.from(emojis).map((emoji) => {
      const gEmoji = emoji.querySelector('g-emoji');
      return {
        title: gEmoji.getAttribute('alias'),
        icon: gEmoji.getAttribute('fallback-src'),
        count: emoji.querySelector('span').textContent,
      };
    });

    const commentAuthor = {
      username: node.querySelector('a.author').textContent,
      avatarImg: node.querySelector('img.avatar')?.getAttribute('src'),
    };

    const formatedComment = {
      HTMLContent: node.querySelector('.edit-comment-hide'),
      id: extractCommentId(node),
    };

    const comment = {
      comment: formatedComment,
      author: commentAuthor,
      reactions: formatedEmojis,
    };

    if (formatedComments.length) {
      formatedComments.push(comment);
    } else formatedComments = [comment];
  });
  if (formatedComments.length) {
    renderUI(formatedComments);
  }
});
