const positiveEmojis = ['+1', 'heart', 'rocket', 'tada', 'smile'];

const sortComments = (comments) => {
  const filteredComments = comments.filter(
    (comment) =>
      comment.comment.HTMLContent &&
      comment.comment.id &&
      comment.reactions.some((reaction) =>
        positiveEmojis.includes(reaction.title)
      )
  );
  const positiveComments = [];

  filteredComments.forEach((comment) => {
    const filteredBadReactions = comment.reactions.filter((reaction) =>
      positiveEmojis.includes(reaction.title)
    );
    const reactionsCount = filteredBadReactions.reduce(
      (a, b) => a + +b.count,
      0
    );
    if (reactionsCount) positiveComments.push({ comment, reactionsCount });
  });
  const sortedResults = positiveComments?.sort(
    (a, b) => b.reactionsCount - a.reactionsCount
  );
  return sortedResults?.slice(0, 3);
};

export const renderUI = (comments) => {
  const sideBarContainer = document.getElementById(
    'partial-discussion-sidebar'
  );

  const itemContainer = document.createElement('div');
  const itemContentContainer = document.createElement('form');
  const itemContentHeader = document.createElement('div');

  itemContainer.classList.add('discussion-sidebar-item');
  itemContentContainer.classList.add('js-issue-sidebar-form');
  itemContentHeader.classList.add('discussion-sidebar-heading', 'text-bold');

  itemContentHeader.append('Top Comments');
  itemContentContainer.appendChild(itemContentHeader);
  itemContainer.appendChild(itemContentContainer);

  const sortedComments = sortComments(comments);

  if (sortedComments.length) {
    sortedComments.forEach((sortedComment) => {
      const comment = sortedComment.comment;
      const commentContainer = document.createElement('div');

      commentContainer.innerHTML = `
        <a  href="#${comment.comment.id}" data-commentid="${
        comment.comment.id
      }" class="issuer-item-container">
              <div class="issuer-item-header">
                  <div class="issuer-item-header-avatar">
                      <img src="${comment.author.avatarImg}"/>
                  </div>
                  <h3 class="issuer-item-header-username">
                      ${comment.author.username}
                  </h3>
              </div>
      
              <div class="issuer-item-content">
                  ${
                    comment.comment.HTMLContent
                      ? comment.comment.HTMLContent.outerHTML
                      : ''
                  }
              </div>
          </a>
        `;
      itemContainer.appendChild(commentContainer);
    });
  } else {
    const emptyStateElm = document.createElement('div');
    emptyStateElm.innerHTML = `
    <span class="css-truncate sidebar-progress-bar">None yet</span>`;
    itemContainer.appendChild(emptyStateElm);
  }
  sideBarContainer.prepend(itemContainer);
};
