export function initialize(/* appInstance */) {
  let titleTag = document.querySelector('title');
  if (titleTag) {
    let title = titleTag.innerHTML;
    let metaTag = document.createElement('meta');
    metaTag.name = 'title-for-ember';
    metaTag.content = title;
    document.head.appendChild(metaTag);
    titleTag.parentElement.removeChild(titleTag);
  }
}

export default {
  name: 'page-title-compat',
  initialize
};
